import { Component, input, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface DatosTarjeta {
  numeroTarjeta: string;
  nombreTitular: string;
  fechaCaducidad: string;
  cvv: string;
}

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent {

  //#region -----propiedades-------------
  // Inputs
  metodoPago = input.required<string>();
  numeroMesa = input.required<number | null>();
  puedeSeleccionarPago = input.required<boolean>();

  // Outputs
  cambiarMetodo = output<string>();
  setNumeroMesa = output<Event>();

  // FormGroup para la tarjeta
  formTarjeta: FormGroup;
  //#endregion--------------------------

  //#region-------metodos---------------
  constructor() {
    this.formTarjeta = new FormGroup(
      {
        numeroTarjeta: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(19), Validators.pattern(/^[0-9\s]+$/)]),
        nombreTitular: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
        fechaCaducidad: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]),
        cvv: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]+$/)])
      }
    );
  }

  OnCambiarMetodo(metodo: string) {
    if (this.puedeSeleccionarPago()) {
      this.cambiarMetodo.emit(metodo);

      // Si cambia a otro método que no sea tarjeta, limpiar el formulario
      if (metodo !== 'tarjeta') {
        this.formTarjeta.reset();
      }
    }
  }

  OnSetNumeroMesa(event: Event) {
    this.setNumeroMesa.emit(event);
  }

  // Formatear número de tarjeta mientras escribe (agregar espacios cada 4 dígitos)
  FormatearNumeroTarjeta(event: Event) {
    const input = event.target as HTMLInputElement;

    // Quitar todo lo que no sea número
    let valor = input.value.replace(/\D/g, '');

    // Limitar a 16 dígitos
    if (valor.length > 16) {
      valor = valor.substring(0, 16);
    }

    // Agregar espacio cada 4 dígitos
    const formatted = valor.match(/.{1,4}/g)?.join(' ') || valor;

    // Actualizar el FormControl
    this.formTarjeta.patchValue({ numeroTarjeta: formatted }, { emitEvent: false });

    // Actualizar el input visual
    input.value = formatted;
  }

  // Formatear fecha mientras escribe (agregar / automáticamente)
  FormatearFechaCaducidad(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 4) {
      valor = valor.substring(0, 4);
    }

    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }

    this.formTarjeta.patchValue({ fechaCaducidad: valor }, { emitEvent: false });

    input.value = valor;
  }

  // Limitar CVV a solo números y máximo 4 dígitos
  LimitarCVV(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 3) {
      valor = valor.substring(0, 3);
    }

    this.formTarjeta.patchValue({ cvv: valor }, { emitEvent: false });

    input.value = valor;
  }

  // Método público para obtener los datos de la tarjeta
  obtenerDatosTarjeta(): DatosTarjeta | null {
    if (!this.formTarjeta.valid) {
      return null;
    }

    const datos = this.formTarjeta.value;

    return {
      numeroTarjeta: datos.numeroTarjeta?.replace(/\s+/g, ''), 
      cvv: datos.cvv?.trim(),
      fechaCaducidad: datos.fechaCaducidad?.trim(),
      nombreTitular: datos.nombreTitular?.trim()
    };
  }

  // Método público para validar el formulario
  esFormularioValido(): boolean {
    return this.formTarjeta.valid;
  }

  // Marcar todos los campos como touched para mostrar errores
  marcarComoTocado() {
    Object.keys(this.formTarjeta.controls).forEach(key => {
      this.formTarjeta.get(key)?.markAsTouched();
    });
  }

  // Helpers para mostrar errores en el template
  mostrarError(campo: string): boolean {
    const control = this.formTarjeta.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formTarjeta.get(campo);

    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['pattern']) {
      if (campo === 'numeroTarjeta') return 'Solo números y espacios';
      if (campo === 'nombreTitular') return 'Solo letras y espacios';
      if (campo === 'fechaCaducidad') return 'Formato: MM/AA';
      if (campo === 'cvv') return 'Solo números';
    }

    return 'Campo inválido';
  }
  //#endregion--------------------------
}