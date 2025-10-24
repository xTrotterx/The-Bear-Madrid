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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tipo_1 = __importDefault(require("../../modelos/tipo"));
const platos_1 = __importDefault(require("../../modelos/platos"));
const RestauranteController = {
    RecuperarTipos: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let pathTipo = req.query.pathTipo;
            console.log('pathTipo recuperado....', pathTipo);
            let _pattern = '^\\d+$';
            if (pathTipo !== 'raiz')
                _pattern = `${pathTipo}-(\\d+-?)`;
            let _regex = new RegExp(_pattern);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _tipos = yield tipo_1.default.find({ pathTipo: { $regex: _regex } });
            console.log('tipos de platos recuperados:...', _tipos);
            res.status(200).send({ codigo: 0, mensaje: 'tipos recuperados con exito', datos: _tipos });
        }
        catch (error) {
            console.log('error el recuperar los tipos en servicio node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar los tipos....' + error });
        }
    }),
    RecuperarPlatos: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let pathTipo = req.query.pathTipo;
            console.log('path recuperado de la url para sacar los platos....', pathTipo);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _platos = yield platos_1.default.find({ pathTipo: pathTipo });
            console.log('platos recuperados:...', _platos);
            res.status(200).send({ codigo: 0, mensaje: 'platos recuperados con exito...', datos: _platos });
        }
        catch (error) {
            console.log('error al recuperar los platos en servicio node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar platos ' + error });
        }
    })
};
exports.default = RestauranteController;
