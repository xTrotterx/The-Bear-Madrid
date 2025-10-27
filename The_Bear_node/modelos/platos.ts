import mongoose, { mongo } from "mongoose";

const platoSchema = new mongoose.Schema(
    {
        nombre:String,
        imagen:String,
        pathTipo:String,
        precio:Number,
        descripcion:String,
        valoraciones:[{type:mongoose.Schema.Types.ObjectId, ref:"Opinion"}]
    }
)

export default mongoose.model("Plato", platoSchema, "platos");
