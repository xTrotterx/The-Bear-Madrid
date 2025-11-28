import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IOrder from '../../../modelos/Interfaces/IOrder';
import IPlato from '../../../modelos/Interfaces/IPlato';
import { MiniPlatoOrderComponent } from "./miniPlatoOrderComponent/mini-plato-order.component";
import { RouterLink } from "@angular/router";
import { RestClienteService } from '../../../servicios/rest-cliente.service';
import { firstValueFrom } from 'rxjs';
import IRestMessage from '../../../modelos/IRestMessage';

@Component({
  selector: 'app-order',
  imports: [MiniPlatoOrderComponent, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  //#region-------servicios--------
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _restSvc = inject(RestClienteService);

  //#endregion

  //#region------propiedades--------
  //señal que se sincroniza con mi storage
  public order = signal<IOrder>(this._storageGlobal.getOrder());
  metodoPago = signal<string>('');

  //computed para calcular el subtotal
  public calcularSubtotal = computed(() => {
    const items = this.order().items || [];
    return items.reduce((sum, item) => sum + (item.plato.precio * item.cantidad), 0);
  });

  //cmputed para calcular total 
  public calcularTotal = computed(() => {
    return this.order().total || 0;
  });

  //computed para total de items
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

    //llamar al mrtodo del storage con la operación correcta
    this._storageGlobal.setItemsOrder($event.operacion, item);

    // Actualizar el signal para refrescar la vista
    // Como _datosOrder en el storage es un signal, podemos obtener su valor actualizado
    this.order.set({ ...this._storageGlobal.getOrder() });


    this.itemModificado.emit($event);
  }

  CambiarMetodo(metodo: string) {
    this.metodoPago.set(metodo);
  }

 async FinalizarCompra() {
  const _datosOrder = this.order()!;

  switch (this.metodoPago()) {
    case 'paypal':
      _datosOrder.metodoPago = { tipo: 'paypal' };
      break;
    case 'tarjeta':
      _datosOrder.metodoPago = { 
        tipo: 'tarjeta', 
        datosTarjeta: { numeroTarjeta: '', cvv: '', fechaCaducidad: '', nombreTitular: '' } 
      };
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


  //#endregion
}