import { Component, inject, Injector, input, Renderer2, Signal } from '@angular/core';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import IPlato from '../../../../modelos/Interfaces/IPlato';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import IOpinion from '../../../../modelos/Interfaces/IOpinion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-opinion',
  imports: [],
  templateUrl: './modal-opinion.component.html',
  styleUrl: './modal-opinion.component.css'
})
export class ModalOpinionComponent {
//#region-----servicios---------
private _restSvc: RestClienteService = inject(RestClienteService);
private _injector=inject(Injector);

//#endregion--------------------

//#region-----propiedades-------
public plato = input.required<IPlato>();
public datosUser = input.required<IUsuario | undefined>();
formOpinion:FormGroup;
valoresOpinion:Signal<IOpinion>;

constructor(){
  this.formOpinion = new FormGroup(
  {
    titulo: new FormControl('', [Validators.required])
  }
  );
  this.valoresOpinion = toSignal(this.formOpinion.valueChanges);
}

//#endregion--------------------

//#region------metodos----------
public estrellas = 0;
public puntos = 0;

private renderer2 = inject(Renderer2);
  punctuacionModal = Array.from({ length: 10 }, (el: any, pos: number) => pos + 1);

Pinta(ev: Event, i: number) {
    console.log('sobre estrella...', ev.target, i);
    for (let index = 1; index <= 5; index++) {
      let _star = this.renderer2.selectRootElement(`i[id="estrella-${index}"]`, true);

      if (index <= i) {
        this.renderer2.setAttribute(_star, 'style', 'color: #0970e6;');
      } else {
        this.renderer2.setAttribute(_star, 'style', ' color:lightgray;');
      }
    }
  }
  public EstrellasSelect(i: number) {
    this.estrellas = i;

    console.log('estrellas', this.estrellas);
  }

  public PuntosSelect(i: number) {
    this.puntos = i;
  }
//#endregion
}
