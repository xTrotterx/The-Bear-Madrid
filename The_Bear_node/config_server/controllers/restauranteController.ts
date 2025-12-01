import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tipo from "../../modelos/tipo";
import Plato from "../../modelos/platos"
import Opinion from "../../modelos/opinion";
import Usuario from "../../modelos/usuario";
import paypal from "../../servicios/paypal";
import Order from "../../modelos/order";
import stripe from "../../servicios/stripe";


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

    PlatosPorTipos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await mongoose.connect(process.env.MONGODB_URL!);

            let _platos = await Plato.find({});


            let _tipos = await Tipo.find({});
            let tiposMap = new Map(_tipos.map(t => [t.pathTipo, t.nombreTipo]));

            // Agrupa por tipo
            let _agrupados: Record<string, any[]> = {};

            _platos.forEach(p => {
                if (!_agrupados[p.pathTipo ?? '']) _agrupados[p.pathTipo ?? ''] = [];
                _agrupados[p.pathTipo ?? ''].push(p);
            });

            // transformo la respuesta para incluir el nombreTipo
            let resultado = Object.entries(_agrupados).map(([pathTipo, platos]) => ({
                pathTipo,
                nombreTipo: tiposMap.get(pathTipo) || pathTipo,
                platos
            }));

            res.status(200).send({ codigo: 0, mensaje: "Platos agrupados por tipo", datos: resultado });
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
            let _plato = await Plato.findByIdAndUpdate(idPlato, { $push: { valoraciones: _op } }, { new: true });
            if (!_plato) throw new Error('no se ha podido actualizar el plato con la nueva opinion');
            console.log('plato actualizado, ', _plato.valoraciones);

            //user
            let _user = await Usuario.findByIdAndUpdate(idUser, { $push: { opiniones: _op } }, { new: true });
            if (!_user) throw new Error('no se ha actualizado el usuario con la nueva opinon');
            console.log('usuario actualizado,', _user.opiniones);

            res.status(200).send({ codigo: 0, mensaje: 'opinion guardada correctamente...', datos: _op });

        } catch (error) {
            console.log('error al guardar la opinion en servicio node', error);
            res.status(500).send({ codigo: 1, mensaje: 'errpr al guardar la opinion....' + error });
        }
    },
    CargarListas: async (req: Request, res: Response, next: Function) => {
        try {
            let _idUser = req.query.idUser;
            console.log('id del usuario, ', _idUser);

            await mongoose.connect(process.env.MONGODB_URL!);
            let _listas = await Usuario.findById(_idUser).populate('favoritos').populate('opiniones').lean();
            console.log('listas del usuario a mostrar....', _listas);

            res.status(200).send({ codigo: 0, mensaje: 'listas recuperadas correctamente....', datos: _listas });
        } catch (error) {
            console.log('error al cargar la lista de favoritos del usuario...', error);
            res.status(500).send({ codigo: 1, mensaje: 'error al cargar los favoritos del usuario en node..., ' + error });
        }
    },
    FinalizarCompra: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const _order = new Order(req.body);
            await _order.save()

            let datos = {}
            switch (_order.metodoPago?.tipo) {
                case 'paypal':
                    const _respOrderPP = await paypal.CreateOrder(_order);

                    if (!_respOrderPP)throw new Error('Error al crear orden de pago en PayPal...');

                    // redirección a la pasarela
                    datos = { urlPayPal: _respOrderPP.link };
                    break;

                case 'tarjeta':
                    const _respOrderST=await stripe.CreateCharge(_order);
                    if(!_respOrderST) throw new Error('Error al procesar elpago con Stripe....');

                    datos={idPagoStripe:_respOrderST.idPagoStripe, estado: _respOrderST.status}
                    break;

                default:
                    break;
            }
            console.log('url:', datos);
            res.status(200).send({ codigo: 0, mensaje: 'pago realizado con exito', datos });
        } catch (error) {
            console.log('error al finalizar el pago con este metodo de pago...', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error al procesar el pago' });
        }
    },
    PaypalCallback: async (req: Request, res: Response, next: NextFunction) => {
        //paypal devuelve iUSer,idOrder y opcional cancel
        console.log('parametros en req.query pasados por el servidor de paypal...', req.query);
        const { idOrder, Cancel, tokenPaypal } = req.query;

        try {
            if (Cancel) throw new Error('Orden cancelado por usuario en el ultimo momento desde paypal....');

            if (!idOrder || !tokenPaypal) throw new Error('Faltan parámetros obligatorios en la callback');

            
            let _finPago = await paypal.CobrarOrderPayPal(tokenPaypal as string);

            if (!_finPago) throw new Error('error cobro del pedido en paypal cagaste ...');
            //redirijo a mi aplicacion de angular
            res.status(200).redirect(`http://localhost:4200/OrderResult?idOrder=${idOrder}&idPedidoPayPal=${tokenPaypal}&opCode=0`);

        } catch (error) {
            console.log('error al finalizar pago del pedido...', error);
            res.status(200).redirect(`http://localhost:4200/OrderResult?idOrder=${idOrder}&opCode=1`);

        }
    }
}
export default RestauranteController;