import IPlato from "./IPlato";

export default interface IOrder{
    items:Array<{plato:IPlato, cantidad:number}>,
    numMesa:number,
    metodoPago:any,
    total:number

}