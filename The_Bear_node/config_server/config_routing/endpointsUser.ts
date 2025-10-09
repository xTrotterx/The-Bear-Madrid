import express from "express";
import UserController from '../controllers/userController';


const routingUser=express.Router();

routingUser.post('/Registro',UserController.Registro);
routingUser.post('/Login', UserController.Login);
routingUser.post('/RefrescarToken', UserController.RefrescarToken);


export default routingUser;