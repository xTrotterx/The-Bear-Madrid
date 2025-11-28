import express from "express";
import RestauranteController from '../controllers/restauranteController';

const routingRestaurante=express.Router();

//platitos
routingRestaurante.get('/PlatosPorTipo',RestauranteController.PlatosPorTipos);
routingRestaurante.get('/Tipos', RestauranteController.RecuperarTipos);
routingRestaurante.get('/Platos', RestauranteController.RecuperarPlatos);
//plato con opiniones
routingRestaurante.get('/Plato', RestauranteController.RecuperarPlato);

//opinioncitas
routingRestaurante.post('/GuardarOpinion', RestauranteController.GuardarOpinion);
routingRestaurante.get('/Listas', RestauranteController.CargarListas);

//paga cabron
routingRestaurante.get('/PayPalCallback', RestauranteController.PaypalCallback);
routingRestaurante.post('FinalizarCompra', RestauranteController.FinalizarCompra);

export default routingRestaurante;