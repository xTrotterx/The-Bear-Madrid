import mongoose from "mongoose";

const tipoSchema=new mongoose.Schema(
    {
        nombreTipo:String,
        pathTipo:String
    }
);

export default mongoose.model("Tipo", tipoSchema, "tipos");