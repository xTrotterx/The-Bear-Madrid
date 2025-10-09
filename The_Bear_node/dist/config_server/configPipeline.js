"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const endpointsCliente_1 = __importDefault(require("./config_routing/endpointsCliente"));
const endpointsRestaurante_1 = __importDefault(require("./config_routing/endpointsRestaurante"));
function configPipeline(serverWeb) {
    serverWeb.use(express_1.default.urlencoded({ extended: true }));
    serverWeb.use(express_1.default.json());
    serverWeb.use((0, cors_1.default)());
    //midlewere de enrutamiento
    serverWeb.use('/api/Cliente', endpointsCliente_1.default);
    serverWeb.use('/api/Restaurante', endpointsRestaurante_1.default);
}
exports.default = configPipeline;
