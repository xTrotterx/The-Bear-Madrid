import IOpinion from "./IOpinion";

export default interface IPlato{
    nombre:string,
    imagenes:[string],
    categoria:string,
    precio:number,
    descripcion:string,
    valoraciones:[IOpinion]

}