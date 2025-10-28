"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restauranteController_1 = __importDefault(require("../controllers/restauranteController"));
const routingRestaurante = express_1.default.Router();
routingRestaurante.get('/Tipos', restauranteController_1.default.RecuperarTipos);
routingRestaurante.get('/Platos', restauranteController_1.default.RecuperarPlatos);
routingRestaurante.get('/PlatosPorTipo', restauranteController_1.default.PlatosPorTipos);
exports.default = routingRestaurante;
