import { computed, Injectable, Signal, signal } from '@angular/core';
import IJwt from '../modelos/IJwt';
import IUsuario from '../modelos/Interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class StorageGlobalService {

  
  private _jwt = signal<IJwt>({ sesion: '', refresh: '', verificacion: '' });
  private _datosUsuario = signal<IUsuario | undefined>(undefined)
  
//hago una señal computada para comprobar si el usuario esta logueado atraves d elos tokens
  private _isLogin:Signal<boolean>=computed<boolean>( ()=>{
    if(this._jwt() && this._jwt().sesion !==''){
      return true;
    }else{
      return false
    }
  })
  constructor() { }
  
//#region---------metodos del Usuario-------------
  getJWT(): IJwt {
    return this._jwt()
  };
  
  setJWT(tipo: string, valor: string) {
    this._jwt.update(antes => ({ ...antes, [tipo]: valor }))
  };

  getDatosUsuario(): IUsuario | undefined {
    return this._datosUsuario();
  };

  setDatosUsuario(datosUsuario: IUsuario) {

    this._datosUsuario.update(antes => {
      if (!!antes) {
        return { ...antes, ...datosUsuario };

      } else {
        return { ...datosUsuario };
      }
    })
  }
  IsLogged():boolean{
    return this._isLogin();
  }
  //#endregion----------------------------------
}
