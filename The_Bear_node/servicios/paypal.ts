import axios from "axios";

export default {
    GetAccessToken: async function (): Promise<string> {
        try {
            const _base64Auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
            let _petToken = await axios(
                {
                    method: 'POST',
                    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
                    data: 'grant_type=client_credentials',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${_base64Auth}`
                    }
                }
            );
            if (_petToken.status == 200) {
                console.log('respuesta al servicio rest de paypal solictiando token de acceso...', _petToken.data);
                return (_petToken.data as any).access_token as string;
            }
            else {
                throw new Error('error al intentar crear token de acceso a la API de PAYPAL...');
            }
        } catch (error) {
            console.log('error al intentar obtener token de acceso a paypal...', error);
            return '';
        }
    },
    CreateOrder: async function (idUSer: string, order: any): Promise<any> {
        try {
            let _accessToken = await this.GetAccessToken();
            let _order = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: order.items.map((itemOrder: any) => {
                            return {
                                name: itemOrder.plato.nombre,
                                quantity: itemOrder.cantidad.toString(),
                                unit_amount: { currency_code: 'EUR', value: itemOrder.plato.precio.toString() }
                            }
                        }),
                        amount: {
                            currency_code: 'EUR',
                            value: order.total.toString(),
                            breakdown:{
                                item_total:{
                                    currency_code:'EUR',
                                    value:order.total.toString()
                                }
                            }
                        }

                    }
                ],
                application_context: {
                    return_url: `http://localhost:3003/api/Restaurante/PayPalCallback?idUser=${idUSer}&idOrder=${order._id}`,
                    cancel_url: `http://localhost:3003/api/Restaurante/PayPalCallback?idUser=${idUSer}&idOrder=${order._id}&Cancel=true`
                }
            }

            let _petOrder = await axios(
                {
                    method: 'POST',
                    url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                    headers: {
                        'Authorization': `Bearer ${_accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(_order)
                }
            );
            if (_petOrder.status == 201) {

                console.log('respuesta de paypal ante la creacion del objeto order del pedido de paypal', _petOrder.data);

                const _linkRedirect = (_petOrder.data as any).links.filter(((link: any) => link.rel == 'approve')).map((link: any) => link.href)[0] || '';
                if (_linkRedirect == '') throw new Error('error al generar link de redireccion hacia la pasarela de pago de PAYPAL al cliente...');

                return {
                    link: _linkRedirect,
                    idPedidoPayPal: (_petOrder.data as any).id
                };

            } else {
                throw new Error('error al intentar pasar a PAYPAL la orden de creacion de cobro...');
            }
        } catch (error) {
            console.log('error al intentar crear objeto pedido o Orden en paypal...', error);
            return null;
        }

    },
    CobrarOrderPayPal: async function (idPedidoPayPal:string):Promise<any> {
        try {
            let _accessToken=await this.GetAccessToken();

            let _petConfirm=await axios(
                {
                    method:'POST',
                    url:`https://api-m.sandbox.paypal.com/v2/checkout/orders/${idPedidoPayPal}/capture`,
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${_accessToken}`,
                    }
                }
            )
            if(_petConfirm.status==201){
                console.log('respuesta dada por paypall al pedir cobro del pedido...', _petConfirm.data);
                return _petConfirm.data;
            }else{
                throw new Error("error al procesar pago en paypal");

            }
        } catch (error) {
            console.log('error al realizar cobro del dinero del pedido en paypal....', error);
            return null;
        }
    }

}
