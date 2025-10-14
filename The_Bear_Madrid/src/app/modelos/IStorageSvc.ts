import IJwt from "./IJwt";
import IUsuario from "./Interfaces/IUsuario";

export default interface IStorageSvc{
    getJWT:() => IJwt,
    setJWT: (tipo:string, valor:string)=> void,
    
    getDatosUsuario: () => IUsuario,
    setDatosUsuario: (datosCliente: IUsuario) => void,
}