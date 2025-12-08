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
    CreateCharge: function (order) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                const STRIPE_SECRET_KEY = process.env.STRIPE_API_KEY;
                if (!STRIPE_SECRET_KEY) {
                    throw new Error("STRIPE_SECRET_KEY no está configurada");
                }
                const numeroTarjeta = (((_b = (_a = order.metodoPago) === null || _a === void 0 ? void 0 : _a.datosTarjeta) === null || _b === void 0 ? void 0 : _b.numeroTarjeta) || '4242424242424242').replace(/\s+/g, '');
                const cvv = (((_d = (_c = order.metodoPago) === null || _c === void 0 ? void 0 : _c.datosTarjeta) === null || _d === void 0 ? void 0 : _d.cvv) || '123').toString().trim();
                const fechaCaducidad = ((_f = (_e = order.metodoPago) === null || _e === void 0 ? void 0 : _e.datosTarjeta) === null || _f === void 0 ? void 0 : _f.fechaCaducidad) || '12/34';
                const [mes, anio] = fechaCaducidad.split("/");
                const nombreTitular = ((_h = (_g = order.metodoPago) === null || _g === void 0 ? void 0 : _g.datosTarjeta) === null || _h === void 0 ? void 0 : _h.nombreTitular) || 'Test User';
                console.log(' datos:', { numeroTarjeta: numeroTarjeta.slice(-4), mes, anio, cvv });
                // 1. Crear PaymentMethod
                const paymentMethodData = new URLSearchParams({
                    "type": "card",
                    "card[number]": numeroTarjeta,
                    "card[exp_month]": mes,
                    "card[exp_year]": anio.length === 2 ? `20${anio}` : anio,
                    "card[cvc]": cvv,
                    "billing_details[name]": nombreTitular
                }).toString();
                console.log('creando PaymentMethod...');
                const paymentMethodResp = yield axios_1.default.post("https://api.stripe.com/v1/payment_methods", paymentMethodData, {
                    headers: {
                        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                const paymentMethodId = paymentMethodResp.data.id;
                console.log('paymentMethod creado:', paymentMethodId);
                // 2. Crear PaymentIntent
                const amount = Math.round(order.total * 100);
                const paymentIntentData = new URLSearchParams({
                    "amount": amount.toString(),
                    "currency": "eur",
                    "payment_method": paymentMethodId,
                    "confirmation_method": "automatic",
                    "confirm": "true",
                    "description": `Pedido restaurante #${order._id}`
                }).toString();
                console.log('creando PaymentIntent...');
                const paymentIntentResp = yield axios_1.default.post("https://api.stripe.com/v1/payment_intents", paymentIntentData, {
                    headers: {
                        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                console.log('paymentIntent status:', paymentIntentResp.data.status);
                if (paymentIntentResp.data.status !== "succeeded") {
                    throw new Error(`Pago no completado. Status: ${paymentIntentResp.data.status}`);
                }
                return {
                    idPagoStripe: paymentIntentResp.data.id,
                    status: paymentIntentResp.data.status
                };
            }
            catch (error) {
                console.error(' ========== ERROR STRIPE ==========');
                if ((_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.error) {
                    console.error('   DETALLES DEL ERROR:');
                    console.error('   Tipo:', error.response.data.error.type);
                    console.error('   Código:', error.response.data.error.code);
                    console.error('   Mensaje:', error.response.data.error.message);
                    console.error('   Decline Code:', error.response.data.error.decline_code);
                    console.error('   Param:', error.response.data.error.param);
                    console.error('   Error completo:', JSON.stringify(error.response.data.error, null, 2));
                }
                else {
                    console.error('   Error general:', error.message);
                }
                console.error('====================================');
                throw error;
            }
        });
    }
};
