"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ClienteController = {
    Registro: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            console.log('Error al realizar el registro', error);
            res.status(200).send({ codigo: 1, mensaje: 'Error en registro...' + error });
        }
    }),
    Login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            console.log('error al realizar el login', error);
            res.status(403).send({ codigo: 1, mensaje: 'Error en el login' });
        }
    })
};
exports.default = ClienteController;
