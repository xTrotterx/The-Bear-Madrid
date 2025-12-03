import { NgIf } from '@angular/common';
import { Component, input, output, OnInit, effect } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-metodo-pago',
  imports: [NgIf],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent implements OnInit {

  metodoPago = input.required<string>();
  numeroMesa = input.required<number | null>();
  puedeSeleccionarPago = input.required<boolean>();

  cambiarMetodo = output<string>();
  setNumeroMesa = output<Event>();

  stripe: Stripe | null = null;
  card!: StripeCardElement;

  // Hacer pública la key para que el padre pueda usarla
  public publicKey = 'pk_test_51O5nh1JrgdkrfrxrA54H605IdtWTQTSY6PVo2c5db5AZwqbwdScBMkEVcghzIfQagwVpZawOOyoKCl8SaLctnLFx007WZ5ppXZ';

  constructor() {
    // Effect para detectar cambios en metodoPago
    effect(() => {
      const metodo = this.metodoPago();
      
      if (metodo === 'tarjeta') {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => this.initStripeCard(), 100);
      } else if (this.card) {
        this.card.unmount();
      }
    });
  }

  async ngOnInit() {
    const stripeLoaded = await loadStripe(this.publicKey);

    if (!stripeLoaded) {
      console.error("No se pudo cargar Stripe");
      return;
    }

    this.stripe = stripeLoaded;
  }

  async initStripeCard() {
    if (!this.stripe) {
      console.error('Stripe no está inicializado');
      return;
    }

    // Verificar que el elemento existe en el DOM
    const cardElement = document.getElementById('card-element');
    if (!cardElement) {
      console.error('Elemento card-element no encontrado en el DOM');
      return;
    }

    // Si ya existe un card montado, desmontarlo primero
    if (this.card) {
      this.card.unmount();
    }

    try {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    } catch (error) {
      console.error('Error al montar el elemento de tarjeta:', error);
    }
  }

  OnCambiarMetodo(metodo: string) {
    if (!this.puedeSeleccionarPago()) {
      return; // No permitir cambiar si no se puede seleccionar
    }
    
    this.cambiarMetodo.emit(metodo);
    // El effect se encargará de montar/desmontar el card
  }

  OnSetNumeroMesa(event: Event) {
    this.setNumeroMesa.emit(event);
  }
}