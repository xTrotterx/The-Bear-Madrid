"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const platos_1 = __importDefault(require("./platos"));
const orderSchema = new mongoose_1.default.Schema({
    items: [{ plato: platos_1.default.schema, cantidad: Number }],
    numMesa: Number,
    metodoPago: { tipo: String, datosTarjeta: { numeroTarjeta: String, cvv: String, fechaCaducidad: String, nombreTitular: String } },
    total: Number,
});
exports.default = mongoose_1.default.model("Order", orderSchema, "orders");
