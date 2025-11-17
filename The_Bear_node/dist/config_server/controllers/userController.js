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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const mailjet_1 = __importDefault(require("../../servicios/mailjet"));
const usuario_1 = __importDefault(require("../../modelos/usuario"));
const UserController = {
    Registro: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('has mandado estos datos desde el servicio de angular para el REGISTRO....', req.body);
            const { nombre, apellidos, telefono, email, password } = req.body;
            console.log('variable conexion mongdob...', process.env.MONGODB_URL);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _nuevoUsuario = yield (new usuario_1.default({
                nombre,
                apellidos,
                telefono,
                email,
                password: bcrypt_1.default.hashSync(password, 10)
            })).save();
            console.log('usuario nuevo insertardo en coleccion usuarios de mongodb....', _nuevoUsuario);
            //genero el jwt usando como codigo el id de mongo
            const _jwt = jsonwebtoken_1.default.sign({ email, codigo: _nuevoUsuario._id }, process.env.JWT_SECRET, { issuer: 'http://localhost:3003', expiresIn: '1h' });
            res.status(200).send({ codigo: 0, mensaje: 'Registro realizado correctamente', datos: { jwtVerificacion: _jwt, datosUsuario: Object.assign(Object.assign({}, _nuevoUsuario.toObject()), { 'password': undefined }) } }); //---> al hacer esto asi sobreescribo la password para que sea mas seguro 
            //envio email de bienvenida
            yield mailjet_1.default.sendEmial(nombre, apellidos, email);
        }
        catch (error) {
            console.log('Error al realizar el registro', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error en registro...' + error });
        }
    }),
    Login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('datos del body mandados desde el login  ', req.body);
            const { email, password } = req.body;
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _user = yield usuario_1.default.findOne({ 'email': email }).lean(); //<-- .lean() me devuelve modelo js y reduce el consumo 
            if (!_user)
                throw new Error('no existe ese usuario con ese email');
            if (!bcrypt_1.default.compareSync(password, _user.password))
                throw new Error('contraseña incorrecta');
            //genero jwt
            const _jwt = jsonwebtoken_1.default.sign({ email, codigo: _user._id }, process.env.JWT_SECRET, { issuer: 'http://localhost:3003', expiresIn: '1h' });
            res.status(200).send({ codigo: 0, mensaje: 'Login realizado con exito correcto ', datos: { jwtVerificacion: _jwt, datosUsuario: Object.assign({}, _user) } });
        }
        catch (error) {
            console.log('error al realizar el login', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error en el login' });
        }
    }),
    RefrescarToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshJWT = req.body.refreshToken;
            if (!refreshJWT)
                throw new Error('no se ha mandado refresh-token....al login de cabeza');
            const _claims = jsonwebtoken_1.default.verify(refreshJWT, process.env.JWT_SECRET);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _datosUser = yield usuario_1.default.findOne({ _id: _claims.idUser, 'cuenta.email': _claims.email });
            if (!_datosUser)
                throw new Error('no existe usuario con ese id o email');
            const _jwtSession = jsonwebtoken_1.default.sign({
                idUser: _datosUser._id,
                email: _datosUser.email,
                nombre: _datosUser.nombre,
                apellidos: _datosUser.apellidos
            }, process.env.JWT_SECRET, { issuer: 'http://localhost:3003', expiresIn: '1h' });
            const _jwtRefresj = jsonwebtoken_1.default.sign({
                idUser: _datosUser._id,
                email: _datosUser.email
            }, process.env.JWT_SECRET, { issuer: 'http://localhost:3003', expiresIn: '72h' });
            res.status(200).send({ codigo: 0, mensaje: 'tokens actualizados correctamente...', datos: { sesionjwt: _jwtSession, refreshjwt: _jwtRefresj } });
        }
        catch (error) {
            console.log('error al refrescar tokens...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al refrescar tokens...' + error });
        }
    }),
    ActualizarFavoritos: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idUser, idPlato } = req.body;
            console.log('id del usuario, ', idUser, ' y del plato ', idPlato);
            yield mongoose_1.default.connect(process.env.MONGODB_URL);
            let _user = yield usuario_1.default.findById(idUser);
            let _existe = _user === null || _user === void 0 ? void 0 : _user.favoritos.some(f => f.equals(idPlato));
            if (_existe) {
                yield usuario_1.default.updateOne({ _id: idUser }, { $pull: { favoritos: idPlato } });
            }
            else {
                yield usuario_1.default.updateOne({ _id: idUser }, { $addToSet: { favoritos: idPlato } } //con esto evito duplicaciones, solo lo mete si no existe, con un push si es posible que se duplique
                );
            }
            res.status(500).send({ codigo: 1, mensaje: 'lista de favoritos actualizada correctamente...', datos: _user === null || _user === void 0 ? void 0 : _user.favoritos });
        }
        catch (error) {
            console.log('error al añadir el plato en la lista favoritos del usuario en node....', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al actualizar favoritos del usuario....' + error });
        }
    }),
    //voy a  cargar de una los favoritos y las opiniones
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
    })
};
exports.default = UserController;
