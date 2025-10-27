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
    const data = this._platosResource.value();
    if (!data || data.codigo !== 0) return [];

    // Convierte Record<string, any[]> a array de secciones
    return Object.entries(data.datos).map(([tipo, platos]) => ({ tipo, platos }));
  })
}
