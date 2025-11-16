import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tipo from "../../modelos/tipo";
import Plato from "../../modelos/platos"
import Opinion from "../../modelos/opinion";
import Usuario from "../../modelos/usuario";


const RestauranteController = {
    RecuperarTipos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let pathTipo = req.query.pathTipo;
            console.log('pathTipo recuperado....', pathTipo);

            let _pattern: string = '^\\d+$';
            if (pathTipo !== 'raiz') _pattern = `${pathTipo}-(\\d+-?)`;

            let _regex: RegExp = new RegExp(_pattern);
            await mongoose.connect(process.env.MONGODB_URL!);

            let _tipos = await Tipo.find({ pathTipo: { $regex: _regex } });
            console.log('tipos de platos recuperados:...', _tipos);

            res.status(200).send({ codigo: 0, mensaje: 'tipos recuperados con exito', datos: _tipos });
        } catch (error) {
            console.log('error el recuperar los tipos en servicio node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar los tipos....' + error });
        }
    },
    RecuperarPlatos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let pathTipo = req.query.pathTipo;
            console.log('path recuperado de la url para sacar los platos....', pathTipo);

            await mongoose.connect(process.env.MONGODB_URL!);
            let _platos = await Plato.find({ pathTipo: pathTipo });
            console.log('platos recuperados:...', _platos);
            res.status(200).send({ codigo: 0, mensaje: 'platos recuperados con exito...', datos: _platos })

        } catch (error) {
            console.log('error al recuperar los platos en servicio node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar platos ' + error })
        }
    },
    //hay que cambiar esta mierda angel espabila
    PlatosPorTipos: async (req: Request, res: Response, next: NextFunction) => {
        try {

            await mongoose.connect(process.env.MONGODB_URL!);

            // Recupera todos los platos
            let _platos = await Plato.find({});

            // Agrupa por tipo
            let _agrupados: Record<string, any[]> = {};

            _platos.forEach(p => {
                if (!_agrupados[p.pathTipo ?? '']) _agrupados[p.pathTipo ?? ''] = [];
                _agrupados[p.pathTipo ?? ''].push(p);
            });

            res.status(200).send({ codigo: 0, mensaje: "Platos agrupados por tipo", datos: _agrupados });
        } catch (error) {
            console.log('error al recuperar datos para el home en node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar platosPorTipos...' + error });
        }
    },

    //en este a parte de sacar un plato voy a sacar tmb sus opiniones asi me ahorro una peticion para solo las opiniones
    RecuperarPlato: async (req: Request, res: Response, next: NextFunction) => {
        try {

            let _idPlato = req.query.idPlato;
            console.log('id del plato', _idPlato);

            await mongoose.connect(process.env.MONGODB_URL!);
            let _plato = await Plato.findById(_idPlato).populate('valoraciones').lean();//<--decueclo las valoraciones enteras en lugar de solo los ids y con lean() lo convierto en json

            res.status(200).send({ codigo: 0, mensaje: 'producto con opiniones recuperados con exito...', datos: _plato });

        } catch (error) {
            console.log('error al recuperar plato con opiniones...', error);
            res.status(500).send({ codgio: 1, mensaje: 'error al recuperar un plato con opiniones...' + error });
        }
    },
    GuardarOpinion: async (req: Request, res: Response, next: NextFunction) => {
        try {

            //primaero debo de guardar la opinion y luego en el usuario que la escribe y en el plato que la recibe
            const { titulo, opinion, puntuacion, estrellas, fecha, idUser, idPlato } = req.body;
            console.log('req.body...', req.body);
            let _nOpinion = new Opinion(
                {
                    titulo: titulo,
                    opinion: opinion,
                    puntuacion: puntuacion,
                    estrellas: estrellas,
                    fecha: fecha ? new Date(fecha) : new Date(),
                    idUser: idUser,
                    idPlato: idPlato
                }
            )
            console.log('nueva opinion: ', _nOpinion.titulo);
            await mongoose.connect(process.env.MONGODB_URL!)
            let _op = await _nOpinion.save();
            console.log('nueva opinion guardada correctamente', _op);

            //platp
            let _plato = await Plato.findByIdAndUpdate(idPlato, { $push: {valoraciones: _op} }, { new: true });
            if (!_plato) throw new Error('no se ha podido actualizar el plato con la nueva opinion');
            console.log('plato actualizado, ', _plato.valoraciones);

            //user
            let _user = await Usuario.findByIdAndUpdate(idUser, { $push: {opiniones: _op}}, { new: true });
            if (!_user) throw new Error('no se ha actualizado el usuario con la nueva opinon');
            console.log('usuario actualizado,', _user.opiniones);

            res.status(200).send({ codigo: 0, mensaje: 'opinion guardada correctamente...', datos: _op });

        } catch (error) {
            console.log('error al guardar la opinion en servicio node', error);
            res.status(500).send({ codigo: 1, mensaje: 'errpr al guardar la opinion....' + error });
        }
    },
    //puede que lo necesite para el perfil
    CargarOpinones: async (req: Request, res: Response, next: NextFunction) => {
        try {

            let _idPlato = req.query.idPlato;
            console.log('id del plato, ', _idPlato);

            await mongoose.connect(process.env.MONGODB_URL!);
            let _opiniones = await Opinion.find({ idPlato: _idPlato });
            console.log('opiniones del plato...', _opiniones);

            res.status(200).send({ codigo: 0, mensaje: 'opiniones del plato recuperadas correctamente...', datos: _opiniones });

        } catch (error) {
            console.log('error al cargar las opiniones de los platos', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al cagrar opiniones' + error });
        }
    }
}
export default RestauranteController;