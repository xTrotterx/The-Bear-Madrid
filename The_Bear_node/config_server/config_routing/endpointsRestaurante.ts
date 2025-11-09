import express from "express";
import RestauranteController from '../controllers/restauranteController';

const routingRestaurante=express.Router();

//platitos
routingRestaurante.get('/Tipos', RestauranteController.RecuperarTipos);
routingRestaurante.get('/Platos', RestauranteController.RecuperarPlatos);
routingRestaurante.get('/PlatosPorTipo',RestauranteController.PlatosPorTipos);
//opinioncitas
routingRestaurante.post('/GuardarOpinion', RestauranteController.GuardarOpinion);
routingRestaurante.get('/CargarOpiniones', RestauranteController.CargarOpinones)


export default routingRestaurante;