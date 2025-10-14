import { Component, inject, Injector, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../../app.config';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import ITipos from '../../../../modelos/Interfaces/ITipos';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
//#region---------servicios---------
  private _injector =inject(Injector);
  private _router=inject(Router);
  private _storageGlobal=inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  
//#endregion

//#region---------propiedades-------
  public datosUsuario=signal<IUsuario>(this._storageGlobal.getDatosUsuario());
  public tipos =signal<ITipos |null> (null)
  public breadCrumb=signal<ITipos[]>()


//#endregion

  public MostrarTipos(){
    this.tipos.set(null);
    this.breadCrumb.set([{}])

  }

}
