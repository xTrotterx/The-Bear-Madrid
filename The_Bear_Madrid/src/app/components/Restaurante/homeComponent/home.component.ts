import { Component, computed, inject, Injector, Resource, resource } from '@angular/core';
import { PlatitoComponent } from '../platoComponent/platitoComponent/platito.component';
import { Router } from '@angular/router';
import IRestMessage from '../../../modelos/IRestMessage';
import IPlato from '../../../modelos/Interfaces/IPlato';

@Component({
  selector: 'app-home',
  imports: [PlatitoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //#region-----servicios--------
  private _injector = inject(Injector);
  private _router = inject(Router)

  //#endregion
  private _platosResource: Resource<IRestMessage> = resource({
    loader: async ({ abortSignal }) => {
      let _resp = await fetch(`http://localhost:3003/api/Restaurante/PlatosPorTipo`,
        { method: 'GET', signal: abortSignal }
      );
      let _body = await _resp.json();
      return _body ?? { codigo: 400, mensaje: 'recuperando los platos por tipo' };
    },
    injector: this._injector
  });

  
  public platosPorTipo = computed(() => {
    const dataPlatos = this._platosResource.value();
    
    if (!dataPlatos || dataPlatos.codigo !== 0) return [];

    return dataPlatos.datos.map((seccion: any) => ({ 
      pathTipo: seccion.pathTipo,
      nombre: seccion.nombreTipo,
      platos: seccion.platos as IPlato[] 
    }));
  });

  // Estado para el carrusel
  currentIndexes: Record<string, number> = {};
  platosVisibles = 4; // Cantidad de platos a mostrar

  getPlatosVisibles(tipo: string, platos: IPlato[]): IPlato[] {
    const startIndex = this.currentIndexes[tipo] ?? 0;
    const resultado = [];
    
    for (let i = 0; i < this.platosVisibles; i++) {
      const index = (startIndex + i) % platos.length;
      resultado.push(platos[index]);
    }
    
    return resultado;
  }

  anterior(tipo: string, platos: IPlato[]): void {
    const index = this.currentIndexes[tipo] ?? 0;
    this.currentIndexes[tipo] = (index - 1 + platos.length) % platos.length;
  }

  siguiente(tipo: string, platos: IPlato[]): void {
    const index = this.currentIndexes[tipo] ?? 0;
    this.currentIndexes[tipo] = (index + 1) % platos.length;
  }
}
