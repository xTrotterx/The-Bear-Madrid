"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const opinionSchema = new mongoose_1.default.Schema({
    titulo: { type: String, required: true },
    opinion: String, // texto de la opinion en si
    puntuacion: Number,
    estrellas: Number,
    fecha: Date,
    idUser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Usuario' },
    idPlato: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Plato' }
});
exports.default = mongoose_1.default.model("Opinion", opinionSchema, "opiniones");
