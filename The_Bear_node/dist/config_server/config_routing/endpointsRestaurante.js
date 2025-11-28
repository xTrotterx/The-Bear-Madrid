"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restauranteController_1 = __importDefault(require("../controllers/restauranteController"));
const routingRestaurante = express_1.default.Router();
//platitos
routingRestaurante.get('/PlatosPorTipo', restauranteController_1.default.PlatosPorTipos);
routingRestaurante.get('/Tipos', restauranteController_1.default.RecuperarTipos);
routingRestaurante.get('/Platos', restauranteController_1.default.RecuperarPlatos);
//plato con opiniones
routingRestaurante.get('/Plato', restauranteController_1.default.RecuperarPlato);
//opinioncitas
routingRestaurante.post('/GuardarOpinion', restauranteController_1.default.GuardarOpinion);
routingRestaurante.get('/Listas', restauranteController_1.default.CargarListas);
//paga cabron
routingRestaurante.get('/PayPalCallback', restauranteController_1.default.PaypalCallback);
routingRestaurante.post('/FinalizarCompra', restauranteController_1.default.FinalizarCompra);
exports.default = routingRestaurante;
