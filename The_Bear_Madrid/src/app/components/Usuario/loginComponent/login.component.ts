import { Component, effect, inject, Injector, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import IForm from '../../../modelos/Interfaces/IForm';
import { RestClienteService } from '../../../servicios/rest-cliente.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import { FooterComponent } from "../../Restaurante/layOutComponent/footerComponent/footer.component";

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //#region----------------propiedades----------------
  formLogin: FormGroup;
  valoresFormLogin: Signal<IForm>;
  pswdVisible = signal<boolean>(false);
  mensajeError = signal<string>('');


  //#endregion

  //#region -----servicios-------
  private _router: Router = inject(Router);
  private _restSvc: RestClienteService = inject(RestClienteService);
  private _injector = inject(Injector)
  private _storeGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS)




  constructor() {
    this.formLogin = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
      }
    );
    this.valoresFormLogin = toSignal(this.formLogin.valueChanges)

  }
  //#region------metodos-----------
  LoginUser($event: any) {
    console.log('datos del login....', this.formLogin.value);

    const _resp = this._restSvc.LoginCliente(this.valoresFormLogin());
    effect(
      () => {
        console.log('respuesta del server al servicio al hacer login..', _resp());

        if (_resp().codigo === 0) {
          this._storeGlobal.setJWT('verificacion', _resp().datos.jwtVerificacion);
          this._storeGlobal.setDatosUsuario(_resp().datos.datosUsuario);

          //redirigir al home
          this._router.navigateByUrl('/Restaurante/Home')
        } else {
          this.mensajeError.set(_resp().mensaje)
        }
      }, { injector: this._injector }
    )
  }
  SetPswdVisible() {
    this.pswdVisible.set(!this.pswdVisible());
  }

  //#endregion

}
