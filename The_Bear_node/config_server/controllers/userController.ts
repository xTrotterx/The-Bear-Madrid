import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import mailjet from "../../servicios/mailjet";

import Usuario from "../../modelos/usuario";
import Opinion from "../../modelos/opinion";
import { existsSync } from "fs";

const UserController = {
    Registro: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('has mandado estos datos desde el servicio de angular para el REGISTRO....', req.body);
            const { nombre, apellidos, telefono, email, password } = req.body;

            console.log('variable conexion mongdob...', process.env.MONGODB_URL);

            await mongoose.connect(process.env.MONGODB_URL!)
            let _nuevoUsuario = await (new Usuario(
                {
                    nombre,
                    apellidos,
                    telefono,
                    email,
                    password: bcrypt.hashSync(password, 10)
                }
            )).save()

            console.log('usuario nuevo insertardo en coleccion usuarios de mongodb....', _nuevoUsuario);

            //genero el jwt usando como codigo el id de mongo
            const _jwt = jsonwebtoken.sign({ email, codigo: _nuevoUsuario._id }, process.env.JWT_SECRET as string, { issuer: 'http://localhost:3003', expiresIn: '1h' });

            res.status(200).send({ codigo: 0, mensaje: 'Registro realizado correctamente', datos: { jwtVerificacion: _jwt, datosUsuario: { ..._nuevoUsuario.toObject(), 'password': undefined } } })//---> al hacer esto asi sobreescribo la password para que sea mas seguro 


            //envio email de bienvenida
            await mailjet.sendEmial(nombre, apellidos, email)

        } catch (error) {
            console.log('Error al realizar el registro', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error en registro...' + error });
        }
    },
    Login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('datos del body mandados desde el login  ', req.body);
            const { email, password } = req.body;

            await mongoose.connect(process.env.MONGODB_URL!);

            let _user = await Usuario.findOne({ 'email': email }).populate('opiniones').populate('favoritos').lean();//<-- .lean() me devuelve modelo js y reduce el consumo 
            if (!_user) throw new Error('no existe ese usuario con ese email');
            if (!bcrypt.compareSync(password, _user.password)) throw new Error('contraseña incorrecta');

            //genero jwt
            const _jwt = jsonwebtoken.sign({ email, codigo: _user._id }, process.env.JWT_SECRET as string, { issuer: 'http://localhost:3003', expiresIn: '1h' });

            res.status(200).send({ codigo: 0, mensaje: 'Login realizado con exito correcto ', datos: { jwtVerificacion: _jwt, datosUsuario: { ..._user } } })

        } catch (error) {
            console.log('error al realizar el login', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error en el login' });
        }
    },
    RefrescarToken: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const refreshJWT = req.body.refreshToken;
            if (!refreshJWT) throw new Error('no se ha mandado refresh-token....al login de cabeza');

            const _claims: { idUser: string, email: string } = jsonwebtoken.verify(refreshJWT, process.env.JWT_SECRET!) as { idUser: string, email: string };

            await mongoose.connect(process.env.MONGODB_URL!);
            let _datosUser = await Usuario.findOne({ _id: _claims.idUser, 'cuenta.email': _claims.email });
            if (!_datosUser) throw new Error('no existe usuario con ese id o email');

            const _jwtSession = jsonwebtoken.sign({
                idUser: _datosUser._id,
                email: _datosUser.email,
                nombre: _datosUser.nombre,
                apellidos: _datosUser.apellidos
            },
                process.env.JWT_SECRET as string,
                { issuer: 'http://localhost:3003', expiresIn: '1h' });

            const _jwtRefresj = jsonwebtoken.sign({
                idUser: _datosUser._id,
                email: _datosUser.email
            },
                process.env.JWT_SECRET as string,
                { issuer: 'http://localhost:3003', expiresIn: '72h' });

            res.status(200).send({ codigo: 0, mensaje: 'tokens actualizados correctamente...', datos: { sesionjwt: _jwtSession, refreshjwt: _jwtRefresj } });



        } catch (error) {
            console.log('error al refrescar tokens...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al refrescar tokens...' + error });
        }
    },
    ActualizarFavoritos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idUser, idPlato } = req.body;
            console.log('id del usuario, ', idUser, ' y del plato ', idPlato);

            await mongoose.connect(process.env.MONGODB_URL!);
            let _user = await Usuario.findById(idUser);

            let _existe = _user?.favoritos.some(f => f.equals(idPlato));

            if (_existe) {
                await Usuario.updateOne(
                    { _id: idUser },
                    { $pull: { favoritos: idPlato } }
                );
            } else {
                await Usuario.updateOne(
                    { _id: idUser },
                    { $addToSet: { favoritos: idPlato } } //con esto evito duplicaciones, solo lo mete si no existe, con un push si es posible que se duplique
                );
            }
            let _userActualizado = await Usuario.findById(idUser);
            console.log('favoritos acutalizados del usuario....', _userActualizado?.favoritos);

            res.status(200).send({codigo:0, mensaje:'lista de favoritos actualizada correctamente...',datos: _userActualizado?.favoritos });
        } catch (error) {
            console.log('error al añadir el plato en la lista favoritos del usuario en node....', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al actualizar favoritos del usuario....' + error });
        }
    }

}
export default UserController;