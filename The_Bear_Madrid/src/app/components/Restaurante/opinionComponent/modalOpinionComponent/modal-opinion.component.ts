import { Component, effect, inject, Injector, input, output, Renderer2, signal, Signal } from '@angular/core';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import IPlato from '../../../../modelos/Interfaces/IPlato';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import IOpinion from '../../../../modelos/Interfaces/IOpinion';

import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IRestMessage from '../../../../modelos/IRestMessage';

@Component({
  selector: 'app-modal-opinion',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-opinion.component.html',
  styleUrl: './modal-opinion.component.css'
})
export class ModalOpinionComponent {
  //#region-----servicios---------
  private _restSvc: RestClienteService = inject(RestClienteService);
  private _injector = inject(Injector);

  //#endregion--------------------

  //#region-----propiedades-------
  public plato = input.required<IPlato>();
  public datosUser = input.required<IUsuario | undefined>();
  formOpinion: FormGroup;
  public valoresOpinion: Signal<Partial<{
    titulo: string;
    comentario: string;
    estrellas: number;
    puntuacion: number | null;
  }>>;
  public estrellasHover = 0;
  //es una señal para almacenar la respuesta, va a ser null hasta que se envie, la respuesta la trato con otra señal
  //necesito mas explicacion
  private _respuestaGuardar = signal<Signal<IRestMessage> | null>(null);
  //mando la nueva opinion al comp padre para poder actualizar el componente y que s emuestre la nueva opinion automaticamente
  public opinionGuardada = output<void>();

  constructor() {
    this.formOpinion = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      opinion: new FormControl('', [Validators.required, Validators.maxLength(350)]),
      estrellas: new FormControl(0, [Validators.required, Validators.min(1)]),
      puntuacion: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)])
    });

    this.valoresOpinion = toSignal(this.formOpinion.valueChanges, { initialValue: this.formOpinion.value });

    effect(() => {
      const respuestaSignal = this._respuestaGuardar();

      // Si no hay respuesta aún, salir
      if (!respuestaSignal) return;

      const resp = respuestaSignal();

      console.log('Respuesta del servidor:', resp);
      // le paso  evento al padre para que se actualice para que cargue la nueva opinion
      this.opinionGuardada.emit();

      // 
      this.formOpinion.reset();
      this.estrellasHover = 0;

      setTimeout(() => {
        const modalElement = document.getElementById('modalOpinion');
        if (modalElement) {
          const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
       }
      )
     }
    )
  }
  //#endregion--------------------

  //#region------metodos----------
  EnviarOpinion($event: any) {
    console.log('datos del modal: ', this.formOpinion.value);

    const opinionParaEnviar = {
      titulo: this.formOpinion.value.titulo,
      opinion: this.formOpinion.value.opinion,
      estrellas: this.formOpinion.value.estrellas,
      puntuacion: this.formOpinion.value.puntuacion,
      fecha: new Date().toISOString(),
      idUser: this.datosUser()?._id,
      idPlato: this.plato()._id,

    };
    let respuestaSignal = this._restSvc.GuardarOpinion(opinionParaEnviar);
    this._respuestaGuardar.set(respuestaSignal);
//aqui me da error el effect y no me cierra el modal, mejor hacerlo en el constructor

  }
  public estrellasSeleccionadas = 0;
  public puntuacionSeleccionada = 0;

  punctuacionModal = Array.from({ length: 5 }, (el: any, pos: number) => pos + 1);

  public Pinta(ev: Event, valor: number) {
    this.estrellasHover = valor;
  }

  public seleccionarEstrella(valor: number) {
    this.formOpinion.patchValue({ estrellas: valor });
  }

  public seleccionarPuntuacion(valor: number) {
    this.formOpinion.patchValue({ puntuacion: valor });
  }

  public get estrellasVisibles(): number {
    return this.estrellasHover > 0
      ? this.estrellasHover
      : (this.valoresOpinion()?.estrellas ?? 0);
  }

  public Blanquea() {
    this.estrellasHover = 0;
  }
  //#endregion
}
