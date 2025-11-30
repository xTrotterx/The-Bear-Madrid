import { Component, inject, input, output, signal, computed, viewChild } from '@angular/core';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IOrder from '../../../modelos/Interfaces/IOrder';
import IPlato from '../../../modelos/Interfaces/IPlato';
import { MiniPlatoOrderComponent } from "./miniPlatoOrderComponent/mini-plato-order.component";
import { RouterLink } from "@angular/router";
import { RestClienteService } from '../../../servicios/rest-cliente.service';
import Swal from 'sweetalert2';
import { MetodoPagoComponent } from './MetodoPagoComponent/metodo-pago.component';

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
        // Validar que el formulario de tarjeta sea válido
        const metodoPagoComp = this.metodoPagoComponent();
        
        if (!metodoPagoComp.esFormularioValido()) {
          // Marcar todos los campos como touched para mostrar errores
          metodoPagoComp.marcarComoTocado();
          
          await Swal.fire({
            icon: 'error',
            title: 'Datos incompletos',
            text: 'Por favor, completa correctamente todos los datos de la tarjeta',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4a3228'
          });
          return;
        }

        // Obtener los datos de la tarjeta desde el componente hijo
        const datosTarjeta = metodoPagoComp.obtenerDatosTarjeta();
        
        if (!datosTarjeta) {
          console.error('No se pudieron obtener los datos de la tarjeta');
          return;
        }

        _datosOrder.metodoPago = { 
          tipo: 'tarjeta', 
          datosTarjeta: datosTarjeta
        };
        break;
    }

    const popup = window.open('', '_blank', 'width=500,height=700');
    try {
      const resp = await this._restSvc.FinalizarCompra(_datosOrder);

      if (resp.codigo === 0 && resp.datos?.urlPayPal) {
        popup!.location.href = resp.datos.urlPayPal;
      } else {
        popup!.close();
        console.error('Error al crear la orden de pago en Paypal:', resp.mensaje);
      }
    } catch (err) {
      popup!.close();
      console.error('Error al llamar al servidor:', err);
    }
  }
}