"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = {
    GetAccessToken: function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _base64Auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
                let _petToken = yield (0, axios_1.default)({
                    method: 'POST',
                    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
                    data: 'grant_type=client_credentials',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${_base64Auth}`
                    }
                });
                if (_petToken.status == 200) {
                    console.log('respuesta al servicio rest de paypal solictiando token de acceso...', _petToken.data);
                    return _petToken.data.access_token;
                }
                else {
                    throw new Error('error al intentar crear token de acceso a la API de PAYPAL...');
                }
            }
            catch (error) {
                console.log('error al intentar obtener token de acceso a paypal...', error);
                return '';
            }
        });
    },
    CreateOrder: function (order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _accessToken = yield this.GetAccessToken();
                let _order = {
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            items: order.items.map((itemOrder) => {
                                return {
                                    name: itemOrder.plato.nombre,
                                    quantity: itemOrder.cantidad.toString(),
                                    unit_amount: { currency_code: 'EUR', value: itemOrder.plato.precio.toString() }
                                };
                            }),
                            amount: {
                                currency_code: 'EUR',
                                value: order.total.toString(),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: order.total.toString()
                                    }
                                }
                            }
                        }
                    ],
                    application_context: {
                        return_url: `http://localhost:3003/api/Restaurante/PayPalCallback?idOrder=${order._id}`,
                        cancel_url: `http://localhost:3003/api/Restaurante/PayPalCallback?idOrder=${order._id}&Cancel=true`
                    }
                };
                let _petOrder = yield (0, axios_1.default)({
                    method: 'POST',
                    url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                    headers: {
                        'Authorization': `Bearer ${_accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(_order)
                });
                if (_petOrder.status == 201) {
                    console.log('respuesta de paypal ante la creacion del objeto order del pedido de paypal', _petOrder.data);
                    const _linkRedirect = _petOrder.data.links.filter(((link) => link.rel == 'approve')).map((link) => link.href)[0] || '';
                    if (_linkRedirect == '')
                        throw new Error('error al generar link de redireccion hacia la pasarela de pago de PAYPAL al cliente...');
                    return {
                        link: _linkRedirect,
                        idPedidoPayPal: _petOrder.data.id
                    };
                }
                else {
                    throw new Error('error al intentar pasar a PAYPAL la orden de creacion de cobro...');
                }
            }
            catch (error) {
                console.log('error al intentar crear objeto pedido o Orden en paypal...', error);
                return null;
            }
        });
    },
    CobrarOrderPayPal: function (idPedidoPayPal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _accessToken = yield this.GetAccessToken();
                let _petConfirm = yield (0, axios_1.default)({
                    method: 'POST',
                    url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${idPedidoPayPal}/capture`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${_accessToken}`,
                    }
                });
                if (_petConfirm.status == 201) {
                    console.log('respuesta dada por paypall al pedir cobro del pedido...', _petConfirm.data);
                    return _petConfirm.data;
                }
                else {
                    throw new Error("error al procesar pago en paypal");
                }
            }
            catch (error) {
                console.log('error al realizar cobro del dinero del pedido en paypal....', error);
                return null;
            }
        });
    }
};
