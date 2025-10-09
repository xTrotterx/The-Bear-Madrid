import { Injectable, signal } from '@angular/core';
import IJwt from '../modelos/IJwt';
import IUsuario from '../modelos/Interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class StorageGlobalService {

  private _jwt = signal<IJwt>({ sesion: '', refresh: '', verificacion: '' });
  private _datosUsuario = signal<IUsuario | undefined>(undefined)

  constructor() { }

  getJWT(): IJwt {
    return this._jwt()
  };
  
  setJwt(tipo: string, valor: string) {
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
}
