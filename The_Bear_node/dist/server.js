"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configPipeline_1 = __importDefault(require("./config_server/configPipeline"));
const app = (0, express_1.default)();
(0, configPipeline_1.default)(app);
app.listen(3003, (error) => {
    if (!error)
        console.log('....servidor escuchando en puerto 3003');
});
