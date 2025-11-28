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
const opinion_1 = __importDefault(require("../../modelos/opinion"));
const usuario_1 = __importDefault(require("../../modelos/usuario"));
const paypal_1 = __importDefault(require("../../servicios/paypal"));
const order_1 = __importDefault(require("../../modelos/order"));
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
    }),
    PlatosPorTipos: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _platos = yield platos_1.default.find({});
            let _tipos = yield tipo_1.default.find({});
            let tiposMap = new Map(_tipos.map(t => [t.pathTipo, t.nombreTipo]));
            // Agrupa por tipo
            let _agrupados = {};
            _platos.forEach(p => {
                var _a, _b, _c;
                if (!_agrupados[(_a = p.pathTipo) !== null && _a !== void 0 ? _a : ''])
                    _agrupados[(_b = p.pathTipo) !== null && _b !== void 0 ? _b : ''] = [];
                _agrupados[(_c = p.pathTipo) !== null && _c !== void 0 ? _c : ''].push(p);
            });
            // transformo la respuesta para incluir el nombreTipo
            let resultado = Object.entries(_agrupados).map(([pathTipo, platos]) => ({
                pathTipo,
                nombreTipo: tiposMap.get(pathTipo) || pathTipo,
                platos
            }));
            res.status(200).send({ codigo: 0, mensaje: "Platos agrupados por tipo", datos: resultado });
        }
        catch (error) {
            console.log('error al recuperar datos para el home en node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar platosPorTipos...' + error });
        }
    }),
    //en este a parte de sacar un plato voy a sacar tmb sus opiniones asi me ahorro una peticion para solo las opiniones
    RecuperarPlato: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _idPlato = req.query.idPlato;
            console.log('id del plato', _idPlato);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _plato = yield platos_1.default.findById(_idPlato).populate('valoraciones').lean(); //<--decueclo las valoraciones enteras en lugar de solo los ids y con lean() lo convierto en json
            res.status(200).send({ codigo: 0, mensaje: 'producto con opiniones recuperados con exito...', datos: _plato });
        }
        catch (error) {
            console.log('error al recuperar plato con opiniones...', error);
            res.status(500).send({ codgio: 1, mensaje: 'error al recuperar un plato con opiniones...' + error });
        }
    }),
    GuardarOpinion: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //primaero debo de guardar la opinion y luego en el usuario que la escribe y en el plato que la recibe
            const { titulo, opinion, puntuacion, estrellas, fecha, idUser, idPlato } = req.body;
            console.log('req.body...', req.body);
            let _nOpinion = new opinion_1.default({
                titulo: titulo,
                opinion: opinion,
                puntuacion: puntuacion,
                estrellas: estrellas,
                fecha: fecha ? new Date(fecha) : new Date(),
                idUser: idUser,
                idPlato: idPlato
            });
            console.log('nueva opinion: ', _nOpinion.titulo);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _op = yield _nOpinion.save();
            console.log('nueva opinion guardada correctamente', _op);
            //platp
            let _plato = yield platos_1.default.findByIdAndUpdate(idPlato, { $push: { valoraciones: _op } }, { new: true });
            if (!_plato)
                throw new Error('no se ha podido actualizar el plato con la nueva opinion');
            console.log('plato actualizado, ', _plato.valoraciones);
            //user
            let _user = yield usuario_1.default.findByIdAndUpdate(idUser, { $push: { opiniones: _op } }, { new: true });
            if (!_user)
                throw new Error('no se ha actualizado el usuario con la nueva opinon');
            console.log('usuario actualizado,', _user.opiniones);
            res.status(200).send({ codigo: 0, mensaje: 'opinion guardada correctamente...', datos: _op });
        }
        catch (error) {
            console.log('error al guardar la opinion en servicio node', error);
            res.status(500).send({ codigo: 1, mensaje: 'errpr al guardar la opinion....' + error });
        }
    }),
    CargarListas: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _idUser = req.query.idUser;
            console.log('id del usuario, ', _idUser);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _listas = yield usuario_1.default.findById(_idUser).populate('favoritos').populate('opiniones').lean();
            console.log('listas del usuario a mostrar....', _listas);
            res.status(200).send({ codigo: 0, mensaje: 'listas recuperadas correctamente....', datos: _listas });
        }
        catch (error) {
            console.log('error al cargar la lista de favoritos del usuario...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al cargar los favoritos del usuario en node..., ' + error });
        }
    }),
    FinalizarCompra: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const _order = new order_1.default(req.body);
            yield _order.save();
            let datos = {};
            switch ((_a = _order.metodoPago) === null || _a === void 0 ? void 0 : _a.tipo) {
                case 'paypal':
                    const _respOrder = yield paypal_1.default.CreateOrder(_order);
                    if (!_respOrder)
                        throw new Error('Error al crear orden de pago en PayPal...');
                    // redirección a la pasarela
                    datos = { urlPayPal: _respOrder.link };
                    break;
                case 'tarjeta':
                    break;
                default:
                    break;
            }
            console.log('url:', datos);
            res.status(200).send({ codigo: 0, mensaje: 'pago realizado con exito', datos });
        }
        catch (error) {
            console.log('error al finalizar el pago con paypal...', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error al procesar el pago' });
        }
    }),
    PaypalCallback: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //paypal devuelve iUSer,idOrder y opcional cancel
        console.log('parametros en req.query pasados por el servidor de paypal...', req.query);
        const { idOrder, Cancel, tokenPaypal } = req.query;
        try {
            if (Cancel)
                throw new Error('Orden cancelado por usuario en el ultimo momento desde paypal....');
            if (!idOrder || !tokenPaypal)
                throw new Error('Faltan parámetros obligatorios en la callback');
            let _finPago = yield paypal_1.default.CobrarOrderPayPal(tokenPaypal);
            if (!_finPago)
                throw new Error('error cobro del pedido en paypal cagaste ...');
            //redirijo a mi aplicacion de angular
            res.status(200).redirect(`http://localhost:4200/OrderResult?idOrder=${idOrder}&idPedidoPayPal=${tokenPaypal}&opCode=0`);
        }
        catch (error) {
            console.log('error al finalizar pago del pedido...', error);
            res.status(200).redirect(`http://localhost:4200/OrderResult?idOrder=${idOrder}&opCode=1`);
        }
    })
};
exports.default = RestauranteController;
