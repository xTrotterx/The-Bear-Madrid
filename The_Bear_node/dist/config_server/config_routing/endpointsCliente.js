"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clienteController_1 = __importDefault(require("../controllers/clienteController"));
const routingCliente = express_1.default.Router();
routingCliente.post('/Registro', clienteController_1.default.Registro);
routingCliente.post('/Login', clienteController_1.default.Login);
exports.default = routingCliente;
