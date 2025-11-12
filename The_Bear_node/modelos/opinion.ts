import mongoose from "mongoose";

const opinionSchema = new mongoose.Schema(
    {
        titulo:{type:String, required:true},
        opinion:String, // texto de la opinion en si
        puntuacion:Number,
        estrellas:Number,
        fecha:Date,
        idUser:{type:mongoose.Schema.Types.ObjectId, ref:'Usuario'},
        idPlato:{type:mongoose.Schema.Types.ObjectId, ref:'Plato'}
    }
)
export default mongoose.model("Opinion", opinionSchema, "opinion");