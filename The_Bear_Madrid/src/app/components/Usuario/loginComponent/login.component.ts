import { Component, inject, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import IForm from '../../../modelos/Interfaces/IForm';
import { RestClienteService } from '../../../servicios/rest-cliente.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //#region----------------propiedades----------------
  public user: {email: string, password: string} = { email: '', password: '' };


  //#endregion

  //#region -----servicios-------
  private _router:Router=inject(Router);
    private _restSvc:RestClienteService=inject(RestClienteService);
 
  
  constructor() {

  }
  //#region------metodos-----------


  //#endregion

}
