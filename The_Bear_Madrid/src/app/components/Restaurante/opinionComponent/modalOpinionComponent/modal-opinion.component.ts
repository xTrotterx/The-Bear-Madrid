import { Component, effect, inject, Injector, input, Renderer2, Signal } from '@angular/core';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import IPlato from '../../../../modelos/Interfaces/IPlato';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import IOpinion from '../../../../modelos/Interfaces/IOpinion';

import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

   constructor() {
    this.formOpinion = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      opinion: new FormControl('', [Validators.required, Validators.maxLength(350)]),
      estrellas: new FormControl(0, [Validators.required, Validators.min(1)]),
      puntuacion: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)])
    });
    
    this.valoresOpinion = toSignal(this.formOpinion.valueChanges, {initialValue: this.formOpinion.value});
  }

  //#endregion--------------------

  //#region------metodos----------
  EnviarOpinion($event:any){
    console.log('datos del modal: ', this.formOpinion.value );

  const opinionParaEnviar = {
      titulo: this.formOpinion.value.titulo,
      opinion: this.formOpinion.value.opinion,
      estrellas: this.formOpinion.value.estrellas,
      puntuacion: this.formOpinion.value.puntuacion,
      fecha: new Date().toISOString(),
      idUser: this.datosUser()?._id,  
      idPlato: this.plato()._id,          
             
    };
    const _resp =this._restSvc.GuardarOpinion(opinionParaEnviar);
   
    effect(()=> {
       let _res= _resp();
      console.log('si el codigo es 0 la opinion se ha guardado bien...', _res.codigo)//<-- me tiene que devolver 0

    })
    

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
    // ✅ Computed para saber qué estrellas pintar
  public get estrellasVisibles(): number {
    // Si hay hover, mostrar hover; si no, mostrar seleccionadas
    return this.estrellasHover > 0 
      ? this.estrellasHover 
      : (this.valoresOpinion()?.estrellas ?? 0);
  }

  public Blanquea() {
    this.estrellasHover = 0;
  }
  //#endregion
}
