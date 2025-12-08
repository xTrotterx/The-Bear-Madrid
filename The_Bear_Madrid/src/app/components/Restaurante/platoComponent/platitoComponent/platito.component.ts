import { Component, computed, inject, input, signal } from '@angular/core';
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
  private _router = inject(Router);

  //#endregion

  //#region----propiedades-----
  plato = input.required<IPlato>();

  cantidadPlatos = computed(() => {
    let order = this._storage.getOrder();
    let item = order.items.find(it => it.plato._id === this.plato()._id);
    return item ? item.cantidad : 0;
  });
  //#endregion

  //#region----metodos-----
  AddToOrder(): void {
    this._storage.setItemsOrder('sumar', {
      plato: this.plato(),
      cantidad: 1
    });
  }
  ModificarCantidad(ope: string) {
    let _plato = this.plato();
    let cantidadActual = this.cantidadPlatos();

    switch (ope) {
      case 'sumar':
        this._storage.setItemsOrder('sumar', {
          plato: _plato,
          cantidad: 1
        });
        break;

      case 'restar':
        if (cantidadActual === 1) {
          this._storage.setItemsOrder('eliminar', {
            plato: _plato,
            cantidad: 0
          });
        } else if (cantidadActual > 1) {
          this._storage.setItemsOrder('restar', {
            plato: _plato,
            cantidad: cantidadActual - 1
          });
        }
        break;
    }
  }

  ElPlatito() {
    this._router.navigate(['Restaurante/Plato', this.plato()._id])
  }

  //#endregion
}
