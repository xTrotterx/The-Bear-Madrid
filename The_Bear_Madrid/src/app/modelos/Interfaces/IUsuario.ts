import IOpinion from "./IOpinion";
import IPlato from "./IPlato";

export default interface IUsuario{
    nombre:string,
    apellidos:string,
    telefono:string,
    email:string,
    password:string,
    favoritos:[IPlato],
    opiniones:[IOpinion]
}