import mongoose from "mongoose";
import platos from "./platos";
const orderSchema = new mongoose.Schema(
    {
        items: [{ plato: platos.schema, cantidad: Number }],
        numMesa: Number,
        metodoPago: { tipo: String, datosTarjeta: { numTarjeta: String, cvv: String, fechCaducidad: String, nombreTitular: String } },
        total: Number,
        
    }
);

export default mongoose.model("Order", orderSchema, "orders");