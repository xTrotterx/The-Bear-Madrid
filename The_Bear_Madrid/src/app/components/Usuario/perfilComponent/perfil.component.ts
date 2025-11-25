import { Component, computed, inject, Injector, resource, Resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IUsuario from '../../../modelos/Interfaces/IUsuario';
import { PlatitoComponent } from '../../Restaurante/platoComponent/platitoComponent/platito.component';
import { OpinionComponent } from '../../Restaurante/opinionComponent/opinion.component';
import IRestMessage from '../../../modelos/IRestMessage';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, PlatitoComponent, OpinionComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  //#region ----------servicios------------
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _injector = inject(Injector);
  //#endregion

  //#region-------------propiedades--------
  public datosUsuario = computed<IUsuario | undefined>(() => this._storageGlobal.getDatosUsuario());

  private _listasResource: Resource<IRestMessage> = resource({
    request: () => this.datosUsuario()?._id, // Función que devuelve el id
    loader: async ({ request, abortSignal }) => {
      if (!request) {
        return { codigo: 400, mensaje: 'No hay usuario logueado', datos: null };
      }

      console.log('id del usuario de las listas a cargar...', request);
      
      let _resp = await fetch(
        `http://localhost:3003/api/Restaurante/Listas?idUser=${request}`,
        { method: 'GET', signal: abortSignal }
      );
      let _body = await _resp.json();
      console.log('listas', _body);
      return _body ?? { codigo: 400, mensaje: 'error al recuperar las listas' };
    },
    injector: this._injector
  });

  public listaFav = computed(() => {
    const data = this._listasResource.value();
    return data?.datos?.favoritos ?? [];
  });

  public listaOp = computed(() => {
    const data = this._listasResource.value();
    return data?.datos?.opiniones ?? [];
  });

  favIndexes: Record<string, number> = {};
  platosVisibles = 3;

  //#endregion

  //#region-----------metodos--------------
  getPlatosVisibles(): any[] {
    const platos = this.listaFav();
    
    // si hay menos no me hace el carrusel
    if (platos.length <= this.platosVisibles) {
      return platos;
    }

    // si hay mas de 3 me hace el carrusel
    const startIndex = this.favIndexes['favoritos'] ?? 0;
    const resultado = [];
    
    for (let i = 0; i < this.platosVisibles; i++) {
      const index = (startIndex + i) % platos.length;
      resultado.push(platos[index]);
    }
    
    return resultado;
  }

  anteriorFav(): void {
    const platos = this.listaFav();
    if (platos.length <= this.platosVisibles) return;
    
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