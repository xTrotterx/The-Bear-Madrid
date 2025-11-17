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


export default routingRestaurante;