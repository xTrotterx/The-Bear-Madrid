
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: "2025-11-17.clover",
});

export default {
    //solo tarjeta 
    CreatePaymentIntent: async function (order: any): Promise<any> {

        try {
            const cantidad = Math.round(order.total * 100); // total en euros → céntimos
            const descripcion = `Pedido ${order._id || ''}`;

            // Crear PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
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

        } catch (error: any) {
            console.error("Error Stripe PaymentIntent:", error);
            return null;
        }
    },
    //movida de revolut
    CreateRevolutPaymentIntent: async function (order: any): Promise<any> {
        try {
            const cantidad = Math.round(order.total * 100);
            const descripcion = `Pedido ${order._id || ''}`;
            const paymentIntent = await stripe.paymentIntents.create({
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

        } catch (error: any) {
            console.error("ErrorRevolut PaymentIntent:", error);
            return null;
        }
    },
    CreateRevolutCheckoutSession: async function (order: any): Promise<any> {
        try {
            const cantidad = Math.round(order.total * 100);

            const session = await stripe.checkout.sessions.create({
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
                success_url:  'http://localhost:4200/?pago=success',
                cancel_url:  'http://localhost:4200/?pago=canceled',
            });

            return {
                url: session.url,
                id: session.id
            };

        } catch (error: any) {
            console.error("Error Revolut Checkout:", error);
            return null;
        }
    }
}
