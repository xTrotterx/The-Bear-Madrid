import { Component, input, linkedSignal, output } from '@angular/core';
import IPlato from '../../../../modelos/Interfaces/IPlato';

@Component({
  selector: 'app-mini-plato-order',
  imports: [],
  templateUrl: './mini-plato-order.component.html',
  styleUrl: './mini-plato-order.component.css'
})
export class MiniPlatoOrderComponent {
//#region-----------servicios-------------
//#endregion

//#region ----------propiedades-----------
plato = input<IPlato>();
cantidad = input.required<number>();

// FIX: linkedSignal corregido
cantidadActual = linkedSignal<number, number>({
  source: this.cantidad,
  computation: (source, previous) => {
    return source; // Retorna el valor de source
  }
});

operarEvent = output<{operacion: string, plato: IPlato, cantidad: number}>();
//#endregion

//#region ---------metodos----------------
ModificaCantidad(operacion: string) {
  switch (operacion) {
    case 'sumar':
      this.cantidadActual.set(this.cantidadActual() + 1);
      this.operarEvent.emit({ 
        operacion: 'sumar', 
        plato: this.plato()!, 
        cantidad: this.cantidadActual() 
      });
      break;

    case 'restar':
      if (this.cantidadActual() > 1) {
        this.cantidadActual.set(this.cantidadActual() - 1);
        this.operarEvent.emit({ 
          operacion: 'restar', 
          plato: this.plato()!, 
          cantidad: this.cantidadActual() 
        });
      }
      break;

    case 'eliminar':
      // Cuando es 1 y presionas la papelera, elimina completamente
      this.cantidadActual.set(0);
      this.operarEvent.emit({ 
        operacion: 'eliminar', 
        plato: this.plato()!, 
        cantidad: 0 
      });
      break;

    default:
      break;
  }
}
//#endregion
}