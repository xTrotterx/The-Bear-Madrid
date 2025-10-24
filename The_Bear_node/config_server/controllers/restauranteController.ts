import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tipo from "../../modelos/tipo";
import Plato from "../../modelos/platos"


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
            let _platos = await Plato.find({pathTipo: pathTipo});
            console.log('platos recuperados:...', _platos);
            res.status(200).send({codigo:0, mensaje: 'platos recuperados con exito...', datos:_platos})

        } catch (error) {
            console.log('error al recuperar los platos en servicio node...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al recuperar platos ' + error })
        }
    }
}
export default RestauranteController;