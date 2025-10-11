import axios from "axios";

export default {
    sendEmial: async (nombre: string, apellidos: string, to: string) => {
        try {
            const _config = Buffer.from(`${process.env.MAILJET_APIKEY}:${process.env.MAILJET_SECRET_APIKEY}`, 'utf-8').toString('base64');

            const _html = `
            <div>
                <h2 style="text-align:center; color:#333;">¡Bienvenido a <strong>The Bear Madrid</strong>! 🐻</h2>
                <p style="text-align:center;">Gracias por unirte a nuestra familia gastronómica. Nos alegra tenerte con nosotros.</p>

                <div style="background-color:#f3f3f3; padding:15px; border-radius:10px;">
                    <h4 style="color:#8b0000;">¿Qué puedes esperar a partir de ahora?</h4>
                    <ul>
                        <li>Recibirás <strong>notificaciones exclusivas</strong> cuando lancemos nuevas ofertas y menús especiales.</li>
                        <li>Podrás disfrutar de <strong>beneficios únicos</strong> solo para miembros registrados.</li>
                        <li>Serás el primero en enterarte de nuestros <strong>eventos y experiencias culinarias</strong>.</li>
                    </ul>
                </div>
                <br>
                <p>Te invitamos a estar atento a tu bandeja de entrada para descubrir todo lo que hemos preparado para ti.</p>
                <br>
                <p>Con cariño,<br><strong>El equipo de The Bear Madrid</strong></p>
            </div>
            `;

            const _mensaje = {
                "Messages": [
                    {
                        "From": {
                            "Email": "atrottepadron@gmail.com",
                            "Name": "Equipo de The Bear Madrid "
                        },
                        "To": [
                            {
                                "Email": to,
                                "Name": apellidos + ", " + nombre
                            }
                        ],
                        "Subject": 'The Bear Madrid',
                        "TextPart": "¡Bienvenido a The Bear Madrid! Te enviaremos notificaciones cuando tengamos nuevas ofertas y eventos especiales.",
                        "HTMLPart": _html
                    }
                ]
            };
            const _respSend = await axios({
                method: 'POST',
                url: 'https://api.mailjet.com/v3.1/send',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${_config}`
                },
                data: JSON.stringify(_mensaje)
            });
            console.log('se ha enviado el correo con exito ', _respSend.data);
            if ((_respSend.data as any).Messages[0].Status !== 'success') throw new Error('error en envio de mail al usuario: ' + _respSend.data);
            return true;
        } catch (error) {
            console.log('error el enviar email en servicio mailjet', error);
            return false;
        }
    }
}