import axios from "axios";

export default {
    CreateCharge: async function (order: any): Promise<any> {
        try {
            const STRIPE_SECRET_KEY = process.env.STRIPE_API_KEY;
            if (!STRIPE_SECRET_KEY) {
                throw new Error("STRIPE_SECRET_KEY no está configurada");
            }

            const numeroTarjeta = (order.metodoPago?.datosTarjeta?.numeroTarjeta || '4242424242424242').replace(/\s+/g, '');
            const cvv = (order.metodoPago?.datosTarjeta?.cvv || '123').toString().trim();
            const fechaCaducidad = order.metodoPago?.datosTarjeta?.fechaCaducidad || '12/34';
            const [mes, anio] = fechaCaducidad.split("/");
            const nombreTitular = order.metodoPago?.datosTarjeta?.nombreTitular || 'Test User';

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

            const paymentMethodResp = await axios.post(
                "https://api.stripe.com/v1/payment_methods",
                paymentMethodData,
                {
                    headers: {
                        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

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

            const paymentIntentResp = await axios.post(
                "https://api.stripe.com/v1/payment_intents",
                paymentIntentData,
                {
                    headers: {
                        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            console.log('paymentIntent status:', paymentIntentResp.data.status);

            if (paymentIntentResp.data.status !== "succeeded") {
                throw new Error(`Pago no completado. Status: ${paymentIntentResp.data.status}`);
            }

            return {
                idPagoStripe: paymentIntentResp.data.id,
                status: paymentIntentResp.data.status
            };

        } catch (error: any) {
            console.error(' ========== ERROR STRIPE ==========');
            
            if (error.response?.data?.error) {
                console.error('   DETALLES DEL ERROR:');
                console.error('   Tipo:', error.response.data.error.type);
                console.error('   Código:', error.response.data.error.code);
                console.error('   Mensaje:', error.response.data.error.message);
                console.error('   Decline Code:', error.response.data.error.decline_code);
                console.error('   Param:', error.response.data.error.param);
                console.error('   Error completo:', JSON.stringify(error.response.data.error, null, 2));
            } else {
                console.error('   Error general:', error.message);
            }
            
            console.error('====================================');
            
            throw error;
        }
    }
}