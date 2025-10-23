"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const platoSchema = new mongoose_1.default.Schema({
    nombre: String,
    imagen: String,
    patTipo: String,
    precio: Number,
    descripcion: String,
    valoraciones: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Opinion" }]
});
exports.default = mongoose_1.default.model("Plato", platoSchema, "platos");
