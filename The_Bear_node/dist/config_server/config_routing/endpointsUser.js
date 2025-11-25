"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const routingUser = express_1.default.Router();
routingUser.post('/Registro', userController_1.default.Registro);
routingUser.post('/Login', userController_1.default.Login);
routingUser.post('/RefrescarToken', userController_1.default.RefrescarToken);
routingUser.post('/ActualizarFav', userController_1.default.ActualizarFavoritos);
exports.default = routingUser;
