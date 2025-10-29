import mongoose from "mongoose";

const tipoSchema=new mongoose.Schema(
    {
        nombreTipo:String,
        pathTipo:String,
        esFinal:Boolean
    }
);

export default mongoose.model("Tipo", tipoSchema, "tipos");