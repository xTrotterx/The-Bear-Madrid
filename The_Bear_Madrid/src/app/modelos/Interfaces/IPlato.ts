import IOpinion from "./IOpinion";

export default interface IPlato{
    nombre:string,
    imagen:string,
    pathTipo:string,
    precio:number,
    descripcion:string,
    valoraciones:[IOpinion],
    _id:string

}