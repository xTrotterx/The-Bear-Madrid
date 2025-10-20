import { Component, inject, Injector, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../../app.config';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import ITipos from '../../../../modelos/Interfaces/ITipos';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
//#region---------servicios---------
  private _injector =inject(Injector);
  private _router=inject(Router);
  private _storageGlobal=inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _restSvc: RestClienteService = inject(RestClienteService);
  
  
//#endregion

//#region---------propiedades-------
  public datosUsuario=signal<IUsuario>(this._storageGlobal.getDatosUsuario());
  public tipos =signal<ITipos |null> (null)
  //public breadCrumb=signal<ITipos[]>()


//#endregion

  public MostrarTipos(){
    this.tipos.set(null);
    //this.breadCrumb.set([{}])
    

  }

   LogOut(){
    this._storageGlobal.setJWT('sesion', '')
    this._storageGlobal.setJWT('refresh', '');
    this._storageGlobal.setDatosUsuario(undefined as any);
   
  }

}
