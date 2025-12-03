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
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: "2025-11-17.clover",
});
class StripeService {
    /**
     * Crea un PaymentIntent para pagos sin registro
     */
    static createPaymentIntent(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cantidad = Math.round(order.total * 100); // total en euros → céntimos
                const descripcion = `Pedido ${order._id || ''}`;
                // Crear PaymentIntent
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: cantidad,
                    currency: "eur",
                    description: descripcion,
                    automatic_payment_methods: {
                        enabled: true, // tarjetas, ApplePay, GooglePay…
                    }
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
    }
}
exports.StripeService = StripeService;
