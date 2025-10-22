import IOpinion from "./IOpinion";

export default interface IPlato{
    nombre:string,
    imagenes:[string],
    pathTipo:string,
    precio:number,
    descripcion:string,
    valoraciones:[IOpinion]

}