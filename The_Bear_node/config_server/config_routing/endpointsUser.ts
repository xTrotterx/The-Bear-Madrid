import express from "express";
import UserController from '../controllers/userController';


const routingUser=express.Router();

routingUser.post('/Registro',UserController.Registro);
routingUser.post('/Login', UserController.Login);
routingUser.post('/RefrescarToken', UserController.RefrescarToken);

routingUser.post('/ActualizarFav', UserController.ActualizarFavoritos);
routingUser.get('/Listas', UserController.CargarListas);


export default routingUser;