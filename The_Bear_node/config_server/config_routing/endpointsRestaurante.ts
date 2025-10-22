import express from "express";
import RestauranteController from '../controllers/restauranteController';

const routingRestaurante=express.Router();

routingRestaurante.get('/Tipos', RestauranteController.RecuperarTipos);
routingRestaurante.get('/Platos', RestauranteController.RecuperarPlatos);


export default routingRestaurante;