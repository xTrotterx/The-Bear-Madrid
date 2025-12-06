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
  
  public publicKey = 'pk_test_51O5nh1JrgdkrfrxrA54H605IdtWTQTSY6PVo2c5db5AZwqbwdScBMkEVcghzIfQagwVpZawOOyoKCl8SaLctnLFx007WZ5ppXZ';

  constructor() {
    // Effect solo para manejar tarjetas
    effect(() => {
      const metodo = this.metodoPago();
      
      if (metodo === 'tarjeta') {
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
    if (!this.puedeSeleccionarPago()) return;
    this.cambiarMetodo.emit(metodo);
  }

  OnSetNumeroMesa(event: Event) {
    this.setNumeroMesa.emit(event);
  }
}