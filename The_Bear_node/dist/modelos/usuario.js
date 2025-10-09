"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usuarioSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: true, default: '' },
    apellidos: { type: String, required: true, default: '' },
    telefono: { type: String,
        required: [true, 'tlf obligatorio'],
        match: [new RegExp('^\\(?\\+?\\d{2}\\)?\\d{9}$'), 'el telefono no cumple con patron, debe ser +341112233']
    },
    email: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    favoritos: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Plato' }],
    opiniones: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Opinion' }],
});
exports.default = mongoose_1.default.model("Usuario", usuarioSchema, "usuarios");
