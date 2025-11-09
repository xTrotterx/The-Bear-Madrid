import { Component, computed, inject, Injector, Resource, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IRestMessage from '../../../modelos/IRestMessage';
import IPlato from '../../../modelos/Interfaces/IPlato';

@Component({
  selector: 'app-mostrar-plato',
  imports: [],
  templateUrl: './mostrar-plato.component.html',
  styleUrl: './mostrar-plato.component.css'
})
export class MostrarPlatoComponent {
//#region-------------servicios-----------------
private _injector= inject(Injector);
private _activatedRoute =inject(ActivatedRoute);

//#endregion

//#region------------propiedades----------------
private _idPlato=signal<string>(this._activatedRoute.snapshot.paramMap.get('idPlato') as string);

//#region------------metodos--------------------
private _platoResource: Resource<IRestMessage>=resource(
  {
    request:this._idPlato,
    loader:async({request,abortSignal,previous})=>{
      console.log('valor de la señal del id: ', this._idPlato())
      let _resp=await fetch(
        `http://localhost:3003/api/Restaurante/Plato?idPlato=${this._idPlato()}`,
        {method:'GET', signal:abortSignal}
      );
      let _body=await _resp.json();
      return _body ?? {codigo:400, mensaje:'error al recuperar el plato'}
    },
    injector:this._injector
  }
);

public plato =computed<IPlato>(()=>{
  let _resp = this._platoResource.value();
  if(_resp?.codigo !== 0) return null;
  return _resp.datos;
});
//mirar para mañana lo del populate para sacar las opiniones y no tener qu ehacer otra peticion para cargar las opiniones

//#endregion
}
