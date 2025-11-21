import { Component, computed, inject, Injector } from '@angular/core';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IUsuario from '../../../modelos/Interfaces/IUsuario';
import { PlatitoComponent } from '../../Restaurante/platoComponent/platitoComponent/platito.component';
import { OpinionComponent } from '../../Restaurante/opinionComponent/opinion.component';

@Component({
  selector: 'app-perfil',
  imports: [PlatitoComponent, OpinionComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  //#region ----------servicios------------
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);

  //#endregion

  //#region-------------propiedades--------
  public datosUsuario = computed<IUsuario | undefined>(() => this._storageGlobal.getDatosUsuario());

  public listaFav = computed(() => this.datosUsuario()?.favoritos ?? []);
  public listaOp = computed(() => this.datosUsuario()?.opiniones ?? []);

  favIndexes: Record<string, number> = {};
  platosVisibles = 3;
  //#endregion

  //#region-----------metodos--------------
    getPlatosVisibles(): any[] {
    let platos = this.listaFav();
    
    // Si hay pocos platos, mostrarlos sin repetir
    if (platos.length <= this.platosVisibles) {
      return platos;
    }

    // Si hay muchos, hacer carrusel
    let startIndex = this.favIndexes['favoritos'] ?? 0;
    let resultado = [];
    
    for (let i = 0; i < this.platosVisibles; i++) {
      const index = (startIndex + i) % platos.length;
      resultado.push(platos[index]);
    }
    
    return resultado;
  }

  anteriorFav(): void {
    let platos = this.listaFav();
    if (platos.length <= this.platosVisibles) return; //no hace nada si tiene pocos fvoritos
    
    const index = this.favIndexes['favoritos'] ?? 0;
    this.favIndexes['favoritos'] = (index - 1 + platos.length) % platos.length;
  }

  siguienteFav(): void {
    const platos = this.listaFav();
    if (platos.length <= this.platosVisibles) return; 
    
    const index = this.favIndexes['favoritos'] ?? 0;
    this.favIndexes['favoritos'] = (index + 1) % platos.length;
  }

  mostrarBotonesFav(): boolean {
    return this.listaFav().length > this.platosVisibles;
  }
  //#endregion


}
