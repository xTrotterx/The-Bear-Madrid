import express, { Express } from "express";
import cors from 'cors';
import routingUsuario from './config_routing/endpointsUser';
import routingRestaurante from './config_routing/endpointsRestaurante';

function configPipeline(serverWeb: Express) {
    serverWeb.use(express.urlencoded({ extended: true, limit:'5mb' }));
    serverWeb.use(express.json({limit:'5mb'}));

    serverWeb.use(cors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    serverWeb.use('/api/Usuario', routingUsuario);
    serverWeb.use('/api/Restaurante', routingRestaurante);
}
export default configPipeline;