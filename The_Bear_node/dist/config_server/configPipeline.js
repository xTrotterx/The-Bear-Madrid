"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const endpointsUser_1 = __importDefault(require("./config_routing/endpointsUser"));
const endpointsRestaurante_1 = __importDefault(require("./config_routing/endpointsRestaurante"));
function configPipeline(serverWeb) {
    serverWeb.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
    serverWeb.use(express_1.default.json({ limit: '5mb' }));
    serverWeb.use((0, cors_1.default)({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    //midlewere de enrutamiento
    serverWeb.use('/api/Usuario', endpointsUser_1.default);
    serverWeb.use('/api/Restaurante', endpointsRestaurante_1.default);
}
exports.default = configPipeline;
