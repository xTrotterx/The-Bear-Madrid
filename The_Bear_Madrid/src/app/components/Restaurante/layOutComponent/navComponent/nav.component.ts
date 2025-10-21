import { Component, computed, ElementRef, inject, Injector, resource, ResourceRef, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../../app.config';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import ITipos from '../../../../modelos/Interfaces/ITipos';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import { NgFor, NgIf } from '@angular/common';
import IRestMessage from '../../../../modelos/IRestMessage';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  //#region---------servicios---------
  private _injector = inject(Injector);
  private _router = inject(Router);
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _restSvc: RestClienteService = inject(RestClienteService);


  //#endregion

  //#region---------propiedades-------
  public breadCrumb = signal<ITipos[]>([{ nombreTipo: 'Menu', pathTipo: 'raiz' }]);
  public tipo = signal<ITipos | null>(null);

  public datosUsuario = signal<IUsuario>(this._storageGlobal.getDatosUsuario());
  public isLogged: boolean = this._storageGlobal.IsLogged();

  public btnCerrar=viewChild<ElementRef>('btnCerrar');


//funcion resource para recuperar los tipos de platos
public tipoResource:ResourceRef<IRestMessage>=resource(
  {
    request: this.tipo,
    loader:async ({request,abortSignal, previous})=>{
      console.log('valor del resource donde van los tipos, ', request, abortSignal, previous);
      let _pathTipo=this.tipo()?.pathTipo || 'raiz';
      let _resp= await fetch(
        `http://localhost:3003/api/Restaurante/Tipos?pathTipo=${_pathTipo}`,
        {method:'GET', signal:abortSignal}
      );
      let _body = await _resp.json();
      return _body ??{codigo:400, mensaje:'recuperando tiops de platos'}
    },
    injector: this._injector
  }
);
public tipos = computed<ITipos[]>(()=> this.tipoResource.value().codigo==0 ? this.tipoResource.value().datos : [] )

  //#endregion
//#region -------metodos---------------------
  public InnitTipos(){
    this.tipo.set(null);
    this.breadCrumb.set([{nombreTipo:'Menu', pathTipo:'raiz'}]);
  }

  public RecuperarSubTipo(tip:ITipos){
    if(/.*-\$$/.test(tip.pathTipo)){
      this.InnitTipos();
      this.btnCerrar()?.nativeElement.click();
      this._router.navigate(['Restaurante/Plato', tip.pathTipo]);
    }

    this.tipo.set(tip);
    this.breadCrumb.update((prev:ITipos[])=>{
      let _pos= prev.findIndex(tipoo =>tipoo.pathTipo ==tip.pathTipo);
      return _pos == -1 ? [...prev, tip]: prev.slice(0, _pos+1)
    })
  }

  LogOut() {
    this._storageGlobal.setJWT('sesion', '')
    this._storageGlobal.setJWT('refresh', '');
    this._storageGlobal.setDatosUsuario(undefined as any);

  }
  //#endregion

}
