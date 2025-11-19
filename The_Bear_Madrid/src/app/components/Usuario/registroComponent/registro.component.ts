import { Component, effect, inject, Injector, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import IForm from '../../../modelos/Interfaces/IForm';
import { Observable } from 'rxjs';
import { RestClienteService } from '../../../servicios/rest-cliente.service';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import { FooterComponent } from "../../Restaurante/layOutComponent/footerComponent/footer.component";

@Component({
  selector: 'app-registro',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, FooterComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  //#region-----------propiedades------------------
  formRegistro: FormGroup;
  valoresRegistro: Signal<IForm>;
  pswdVisible = signal<boolean>(false);
  repswdVisible = signal<boolean>(false);
  mensajeError = signal<string>('');

  //#endregion

  //#region----------servicios-----------
  private _restSvc = inject(RestClienteService);
  private _router = inject(Router);
  private _injector = inject(Injector);
  private _storeGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);


  constructor() {
    this.formRegistro = new FormGroup(
      {
        nombre: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
        apellidos: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]),
        telefono: new FormControl('', [Validators.required, Validators.pattern('^\\(?\\+?\\d{2}\\)?\\d{9}$')]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%\&\^*\-]).{6,20}$')]),
        repassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%\&\^*\-]).{6,20}$')]),
      }
    );

    this.valoresRegistro = toSignal(this.formRegistro.valueChanges);
  }

  //#region---------metodos-------------
  RegistrarUser($event: any) {
    console.log('datos del form: ', this.formRegistro.value);

    const _resp = this._restSvc.RegistroUsuario(this.valoresRegistro());
    effect(
      () => {
        console.log('respuesta del server para el registro....', _resp());

        if (_resp().codigo === 0) {

          this._storeGlobal.setJWT('verificacion', _resp().datos.jwtVerificacion);
          this._storeGlobal.setDatosUsuario(_resp().datos.datosUsuario);

          //redirijo al componente home
          this._router.navigateByUrl('/Restaurante/Home');

        } else {
          //mensaje de error
          this.mensajeError.set(_resp().mensaje)
        }
      },{injector: this._injector}
    )
  }
  SetPswdVisible() {
    this.pswdVisible.set(!this.pswdVisible());
  }
  SetRePswdVisible() {
    this.repswdVisible.set(!this.repswdVisible());
  }
}


