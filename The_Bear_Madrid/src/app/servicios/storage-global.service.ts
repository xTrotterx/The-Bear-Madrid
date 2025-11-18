import { computed, Injectable, Signal, signal } from '@angular/core';
import IJwt from '../modelos/IJwt';
import IUsuario from '../modelos/Interfaces/IUsuario';
import IOrder from '../modelos/Interfaces/IOrder';
import IStorageSvc from '../modelos/IStorageSvc';
import IPlato from '../modelos/Interfaces/IPlato';

@Injectable({
  providedIn: 'root'
})
export class StorageGlobalService implements IStorageSvc {


  private _jwt = signal<IJwt>({ sesion: '', refresh: '', verificacion: '' });
  private _datosUsuario = signal<IUsuario | undefined>(undefined);
  private _datosOrder = signal<IOrder>(
    {
      items: [],
      metodoPago: {},
      numMesa: 0,
      total: 0
    }
  );

  //hago una señal computada para comprobar si el usuario esta logueado atraves d elos tokens
  /* private _isLogin:Signal<boolean>=computed<boolean>( ()=>{
     if(this._jwt() && this._jwt().sesion !==''){
       return true;
     }else{
       return false
     }
   })
     */
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
  };

  LogOut() {
    this._jwt.set({ sesion: '', refresh: '', verificacion: '' });
    this._datosUsuario.set(undefined);
    this._datosOrder.set({
      items: [],
      metodoPago: {},
      numMesa: 0,
      total: 0
    });
  }
  // IsLogged():boolean{
  // return this._isLogin();
  //}
  //#endregion----------------------------------

  //#region ------metodos del Restaurante--------
  getOrder(): IOrder {
      return this._datosOrder();
    };
  setItemsOrder(operacion: string, item: { plato: IPlato; cantidad: number; }) {
      let _items: Array<{ plato: IPlato, cantidad: number }> = this._datosOrder().items;
      let _pos: number = _items.findIndex(it => it.plato._id == item.plato._id);

      switch(operacion) {
      case 'sumar':
      if(_pos == -1) {
      console.log('no existe el plato en el order, se añade');
      _items.push(item);
    } else {
      console.log('ya hay este plato en el order vamos a meter otro');
      _items = _items.map(it => it.plato._id !== item.plato._id ? it : { ...it, cantidad: it.cantidad + 1 })
    }
    break;

      case 'eliminar':
    console.log('vamos a eliminar el plato del order');
    _items = _items.filter(it => it.plato._id !== item.plato._id);
    break;

      case 'restar':
    console.log('restar item....');
    if (_pos !== -1) {
      _items = _items.map(it => it.plato._id !== item.plato._id ? it : { ...it, cantidad: item.cantidad })
    }
    break;
      default:
    break;
}
let _total = Math.round(_items.reduce((ac, el) => (el.plato.precio * el.cantidad) + ac, 0) * 100 / 100);

this._datosOrder.update(
  (order: IOrder) => ({
    ...order,
    items: _items,
    total: _total
  })

)
console.log('Order actualizado...', this._datosOrder());
  }
  //#endregion
}
