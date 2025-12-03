import { Component, inject, input, output, signal, computed, viewChild } from '@angular/core';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IOrder from '../../../modelos/Interfaces/IOrder';
import IPlato from '../../../modelos/Interfaces/IPlato';
import { MiniPlatoOrderComponent } from "./miniPlatoOrderComponent/mini-plato-order.component";
import { RouterLink } from "@angular/router";
import { RestClienteService } from '../../../servicios/rest-cliente.service';
import Swal from 'sweetalert2';
import { MetodoPagoComponent } from './MetodoPagoComponent/metodo-pago.component';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-order',
  imports: [MiniPlatoOrderComponent, MetodoPagoComponent, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  //#region-------servicios--------
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _restSvc = inject(RestClienteService);
  //#endregion

  //#region------referencias a componentes hijos--------
  metodoPagoComponent = viewChild.required(MetodoPagoComponent);
  //#endregion

  //#region------propiedades--------
  //señal que se sincroniza con mi storage
  public order = signal<IOrder>(this._storageGlobal.getOrder());
  metodoPago = signal<string>('');
  numeroMesa = signal<number | null>(null);

  //computed para validar si se puede seleccionar método de pago
  public puedeSeleccionarPago = computed(() => {
    return this.numeroMesa() !== null && this.numeroMesa()! > 0;
  });

  public calcularTotal = computed(() => {
    return this.order().total || 0;
  });

  public obtenerTotalItems = computed(() => {
    const items = this.order().items || [];
    return items.reduce((sum, item) => sum + item.cantidad, 0);
  });
  //#endregion

  //#region------metodos------------
  mensaje = input<string>('');
  itemModificado = output<{ operacion: string; plato: IPlato; cantidad: number; }>();

  ModificaCantidadItem($event: { operacion: string; plato: IPlato; cantidad: number; }) {
    console.log('Evento recibido desde componente hijo:', $event);

    //actualizar los items en el storeglobal
    const item = {
      plato: $event.plato,
      cantidad: $event.cantidad
    };

    //llamar al método del storage con la operación correcta
    this._storageGlobal.setItemsOrder($event.operacion, item);

    // Actualizar el signal para refrescar la vista
    this.order.set({ ...this._storageGlobal.getOrder() });
    this.itemModificado.emit($event);
  }

  CambiarMetodo(metodo: string) {
    this.metodoPago.set(metodo);
  }

  SetNumeroMesa(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = parseInt(input.value, 10);

    if (isNaN(valor) || valor <= 0) {
      this.numeroMesa.set(null);
    } else {
      this.numeroMesa.set(valor);
    }
  }

 async FinalizarCompra() {
  const _datosOrder = this.order()!;

  // Establecer el número de mesa en el order
  _datosOrder.numMesa = this.numeroMesa()!;

  // Si es efectivo, mostrar mensaje y redirigir
  if (this.metodoPago() === 'efectivo') {
    await Swal.fire({
      icon: 'success',
      title: '¡Gracias por elegirnos!',
      text: 'Que disfrutes de la experiencia',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#4a3228',
      timer: 3000,
      timerProgressBar: true
    });

    // Redirigir al home
    window.location.href = '/';
    return;
  }

  switch (this.metodoPago()) {
    case 'paypal':
      _datosOrder.metodoPago = { tipo: 'paypal' };
      break;

    case 'tarjeta':
      const metodoPagoComp = this.metodoPagoComponent();

      if (!metodoPagoComp.card) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo inicializar el formulario de tarjeta'
        });
        return;
      }

      _datosOrder.metodoPago = { tipo: 'tarjeta' };
      break;
  }

  try {
    const resp = await this._restSvc.FinalizarCompra(_datosOrder);

    if (_datosOrder.metodoPago.tipo === 'paypal') {
      if (resp.datos?.urlPayPal) {
        const popup = window.open('', '_blank', 'width=500,height=700');
        popup!.location.href = resp.datos.urlPayPal;
      }
    }

    if (_datosOrder.metodoPago.tipo === 'tarjeta') {
      const clientSecret = resp.datos?.clientSecret;
      console.log('Client secret recibido:', clientSecret);

      if (!clientSecret) {
        await Swal.fire({
          icon: 'error',
          title: 'Error en el pago',
          text: 'No se pudo iniciar el pago con tarjeta'
        });
        return;
      }

      // ⚠️ CLAVE: Usar la MISMA instancia de Stripe que creó el card
      const metodoPagoComp = this.metodoPagoComponent();
      const stripe = metodoPagoComp.stripe;
      const cardElement = metodoPagoComp.card;

      if (!stripe) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Stripe no está inicializado correctamente'
        });
        return;
      }

      // Confirmar el pago con la misma instancia
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement
          }
        }
      );

      if (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Tarjeta rechazada',
          text: error.message ?? 'No se pudo procesar la tarjeta'
        });
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        await Swal.fire({
          icon: 'success',
          title: 'Pago completado',
          text: 'Tu pago con tarjeta se realizó correctamente'
        });
      
        window.location.href = '/';
      }

      return;
    }

  } catch (err) {
    console.error('Error al llamar al servidor:', err);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al procesar el pago'
    });
  }
}
}