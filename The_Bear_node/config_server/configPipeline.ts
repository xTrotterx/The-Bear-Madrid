import express,{ Express } from "express";
import cors from 'cors';
import routingCliente from './config_routing/endpointsUser';
import routingRestaurante from'./config_routing/endpointsRestaurante';

function configPipeline(serverWeb:Express){
    serverWeb.use(express.urlencoded({extended:true}));
    serverWeb.use(express.json());
    serverWeb.use(cors());

    //midlewere de enrutamiento
    serverWeb.use('/api/Cliente', routingCliente);
    serverWeb.use('/api/Restaurante', routingRestaurante);
}
export default configPipeline;