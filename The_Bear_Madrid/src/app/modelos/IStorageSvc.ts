import IJwt from "./IJwt";
import IOrder from "./Interfaces/IOrder";
import IPlato from "./Interfaces/IPlato";
import IUsuario from "./Interfaces/IUsuario";

export default interface IStorageSvc{
    getJWT:() => IJwt,
    setJWT: (tipo:string, valor:string)=> void,
    
    getDatosUsuario: () => IUsuario,
    setDatosUsuario: (datosCliente: IUsuario) => void,

    IsLogged:() => boolean,

    getorder: ()=> IOrder,
    setItemsOrder: (operacion:string,item:{plato:IPlato, cantidad:number})=> void
}