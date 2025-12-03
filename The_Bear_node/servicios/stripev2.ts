
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: "2025-11-17.clover",
});

export class StripeService {

    /**
     * Crea un PaymentIntent para pagos sin registro
     */
    static async createPaymentIntent(order: any) {
        try {
            const cantidad = Math.round(order.total * 100); // total en euros → céntimos
            const descripcion = `Pedido ${order._id || ''}`;

            // Crear PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: cantidad,
                currency: "eur",
                description: descripcion,

                automatic_payment_methods: {
                    enabled: true,   // tarjetas, ApplePay, GooglePay…
                }
            });

            return {
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id,
                status: paymentIntent.status
            };

        } catch (error: any) {
            console.error("Error Stripe PaymentIntent:", error);
            return null;
        }
    }
}
