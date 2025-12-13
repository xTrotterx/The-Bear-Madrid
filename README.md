# The Bear Madrid

## Introducción y justificación

**The Bear Madrid** es una aplicación web para un restaurante con el fin de facilitar el trabajo del personal y hacer menos invasiva la experiencia del cliente. El usuario puede tomarse el tiempo que necesite para ver la carta, realizar el pedido y recibirlo en la mesa sin la necesidad de dar una respuesta rápida.

---

## Análisis y diseño del proyecto

La aplicación sigue una arquitectura **SPA (Single Page Application)**, cargando una única página dinámica que actualiza el contenido sin recargar la página completa.

### Tecnologías empleadas

#### Frontend

* Angular 19
* TypeScript
* RxJS
* Stripe JS
* MapBox GL
* MapBox GL Directions
* SweetAlert2
* Bootstrap
* Bootstrap Icons

#### Backend

* Node
* TypeScript
* Express
* Cors
* Mongoose
* Stripe
* Bcrypt
* JWT
* Axios

#### Base de datos

* MongoDB

### Integraciones

* SDK de Stripe
* API de PayPal
* SDK de MapBox
* API de MailJet

---

## Análisis de usuarios

* Modo invitado: sin acceso al perfil ni posibilidad de realizar valoraciones.
* Usuario registrado: acceso a todas las funcionalidades, añadir favoritos y realizar valoraciones.

---

## Definición de requisitos funcionales y no funcionales

### Requisitos funcionales

* Registro con validadores.
* Mostrar los platos y su información.
* Dejar opiniones solo si el usuario tiene perfil y no ha realizado ya una opinión.
* Añadir platos a una lista de favoritos.
* Pago con distintos métodos de pago.
* Consultar la ubicación del local e introducir la dirección desde la que se desea desplazar.

### Requisitos no funcionales

* No se puede acceder al path del perfil si el usuario no está logeado.
* Los platos se cargan con un resolver para evitar recargas innecesarias.
* Configuración CORS que permite interacciones con servicios externos.
* Diseño responsive.

---

## Estructura de navegación

* **Parte del usuario: `/Registro`, `/Login`
* Parte del restaurante: `/Home`, `/Platos/:pathTipo`, `/Plato/:idPlato`, `/Mapa`, `/Perfil`, `/Order`

---

## Organización de la lógica de negocio

El backend está separado en dos apartados principales: **Usuario** y **Restaurante**, donde se maneja el flujo de datos de cada parte.

* Servicio de **PayPal** encargado de realizar pagos redirigiendo a la pasarela de PayPal.
* Servicio de **Stripe** para pagos con tarjeta bancaria y la opción de **Revolut Pay**, gestionado a través de Stripe.
* Servicio de **MailJet** para el envío de correos al registrarse.

---

## Modelo de datos simplificado

### Colecciones de MongoDB

| Colección     | Descripción                                                        |
| ------------- | ------------------------------------------------------------------ |
| **opiniones** | Valoración del personal, valoración del plato y valoración escrita |
| **orders**    | Platos, método de pago y cantidad                                  |
| **platos**    | Información del plato y opiniones                                  |
| **tipos**     | Categoría a la que pertenece el plato                              |
| **usuarios**  | Datos del usuario, email, contraseña y listas del usuario          |

---

## Conclusiones

### Resultados obtenidos

Los principales objetivos, como la implementación de distintos métodos de pago o la integración de una API de mapas para establecer rutas, han sido cumplidos con éxito.

### Retos encontrados

Uno de los aspectos más complejos ha sido la gestión de varios métodos de pago. A través de Stripe se pueden manejar distintos métodos, y para Revolut ha sido especialmente útil, ya que su API exige requisitos que no pueden cumplirse en entornos de pruebas o preproducción.

Otro reto destacable ha sido la agrupación de los platos por tipos incluyendo el nombre de estos, tratándolo como un sistema clave-valor, donde la clave es el tipo y el valor un array de platos.

### Aprendizaje y mejoras futuras

He profundizado en el desarrollo de aplicaciones web utilizando Angular, especialmente en el uso de la reactividad para la gestión de datos y la interacción con la interfaz de usuario.

Como mejoras futuras, se incluiría una mayor personalización del perfil, permitiendo modificar datos, borrar o editar opiniones y la posibilidad de eliminar la cuenta.

---

## Bibliografía

* [Documentación oficial de Angular](https://angular.dev)
* [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [Bootstrap Icons](https://icons.getbootstrap.com)
* [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
* [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)
* [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
* [Stripe Payment Intents](https://docs.stripe.com/payments/payment-intents)
* [Stripe Card Payments](https://docs.stripe.com/js/payment_intents/confirm_card_payment)
* [Revolut Pay con Stripe](https://docs.stripe.com/payments/revolut-pay)

---

## Guía de instalación

### Backend

```bash
cd .\The_Bear_node
npm install
npm start
```

### Frontend

```bash
cd ./The_Bear_Madrid
npm install
ng serve
```

---

## Autoría

**The Bear Madrid**
Ángel Trotter Padrón
Desarrollo de Aplicaciones Web 2025
IES Alonso de Avellaneda
