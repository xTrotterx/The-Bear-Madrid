import { Component, inject, input, output, signal, computed } from '@angular/core';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import IOrder from '../../../modelos/Interfaces/IOrder';
import { PlatitoComponent } from "../platoComponent/platitoComponent/platito.component";
import IPlato from '../../../modelos/Interfaces/IPlato';
import { MiniPlatoOrderComponent } from "./miniPlatoOrderComponent/mini-plato-order.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order',
  imports: [PlatitoComponent, MiniPlatoOrderComponent, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
//#region-------servicios--------
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
//#endregion

//#region------propiedades--------
  //señal que se sincroniza con mi storage
  public order = signal<IOrder>(this._storageGlobal.getOrder());

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
    this.order.set({...this._storageGlobal.getOrder()});
    
    // Emitir el evento al componente padre si existe
    this.itemModificado.emit($event);
  }
//#endregion
}