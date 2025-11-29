import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent {
  // Inputs
  metodoPago = input.required<string>();
  numeroMesa = input.required<number | null>();
  puedeSeleccionarPago = input.required<boolean>();

  // Outputs
  cambiarMetodo = output<string>();
  setNumeroMesa = output<Event>();

  OnCambiarMetodo(metodo: string) {
    if (this.puedeSeleccionarPago()) {
      this.cambiarMetodo.emit(metodo);
    }
  }

  OnSetNumeroMesa(event: Event) {
    this.setNumeroMesa.emit(event);
  }
}