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
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: "2025-11-17.clover",
});
exports.default = {
    //solo tarjeta 
    CreatePaymentIntent: function (order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cantidad = Math.round(order.total * 100); // total en euros → céntimos
                const descripcion = `Pedido ${order._id || ''}`;
                // Crear PaymentIntent
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: cantidad,
                    currency: "eur",
                    description: descripcion,
                    payment_method_types: ['card']
                });
                return {
                    clientSecret: paymentIntent.client_secret,
                    id: paymentIntent.id,
                    status: paymentIntent.status
                };
            }
            catch (error) {
                console.error("Error Stripe PaymentIntent:", error);
                return null;
            }
        });
    },
    //movida de revolut
    CreateRevolutPaymentIntent: function (order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cantidad = Math.round(order.total * 100);
                const descripcion = `Pedido ${order._id || ''}`;
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: cantidad,
                    currency: "eur",
                    description: descripcion,
                    payment_method_types: ['revolut_pay'],
                });
                return {
                    clientSecret: paymentIntent.client_secret,
                    id: paymentIntent.id,
                    status: paymentIntent.status
                };
            }
            catch (error) {
                console.error("ErrorRevolut PaymentIntent:", error);
                return null;
            }
        });
    },
    CreateRevolutCheckoutSession: function (order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cantidad = Math.round(order.total * 100);
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['revolut_pay'],
                    line_items: [{
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: `Pedido ${order._id || ''}`,
                                },
                                unit_amount: cantidad,
                            },
                            quantity: 1,
                        }],
                    mode: 'payment',
                    success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/?pago=success`,
                    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/?pago=canceled`,
                });
                return {
                    url: session.url,
                    id: session.id
                };
            }
            catch (error) {
                console.error("Error Revolut Checkout:", error);
                return null;
            }
        });
    }
};
