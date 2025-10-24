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
            const pathTipo = req.query.pathTipo;
            console.log('pathTipo recibido:', pathTipo);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _tipos;
            if (pathTipo === 'raiz') {
                // Tipos raíz: 1, 2, 3...
                _tipos = yield tipo_1.default.find({ pathTipo: { $regex: '^\\d+$' } });
            }
            else {
                // Buscar subtipos
                const subtipos = yield tipo_1.default.find({ pathTipo: { $regex: `^${pathTipo}-\\d+$` } });
                // Buscar elementos finales (terminan en -$)
                const finales = yield tipo_1.default.find({ pathTipo: `${pathTipo}-1-$` }); // o tu regla para finales
                // Si tus finales pueden variar en número (3-1-$, 3-2-$, etc.), usa regex:
                // const finales = await Tipo.find({ pathTipo: { $regex: `^${pathTipo}-\\d+-\\$` } });
                _tipos = [...subtipos, ...finales];
            }
            console.log('Tipos recuperados:', _tipos);
            res.status(200).send({
                codigo: 0,
                mensaje: 'Tipos y finales recuperados con éxito',
                datos: _tipos
            });
        }
        catch (error) {
            console.log('Error al recuperar tipos:', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error al recuperar tipos: ' + error });
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
