import { Component, inject, input, signal } from '@angular/core';
import IPlato from '../../../../modelos/Interfaces/IPlato';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platito',
  imports: [],
  templateUrl: './platito.component.html',
  styleUrl: './platito.component.css'
})
export class PlatitoComponent {
  //#region---servicios--------
  private _storage = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _router=inject(Router);

  //#endregion

  //#region----propiedades-----
  plato = input.required<IPlato>();
  cantidadPlatos = signal<number>(0);

  //#endregion


  //#region----metodos-----

  SetCantidadPlatosFromInput(ev: any) {
    ev.target.value !== '' ? this.cantidadPlatos.set(parseInt(ev.target.value)) : this.cantidadPlatos.set(1)
  }
  AddToOrder():void{
    this.cantidadPlatos.set(1);
    this._storage.setItemsOrder('sumar', {plato:this.plato(),cantidad:1})
  }
  ModificarCantidad(ope: string) {
    switch (ope) {
      case 'sumar':
        this.cantidadPlatos.set(this.cantidadPlatos() + 1);
        break;
      case 'restar':
        this.cantidadPlatos.set(this.cantidadPlatos() - 1)
        break;
    }
    this._storage.setItemsOrder(this.cantidadPlatos() == 0 ? 'eliminar' : 'restar', { plato: this.plato(), cantidad: this.cantidadPlatos() })

  }

  ElPlatito(){
    this._router.navigate(['Restaurante/Plato', this.plato()._id])
  }

  //#endregion
}
