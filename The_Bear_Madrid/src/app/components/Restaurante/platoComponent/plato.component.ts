import { Component, computed, inject, Injector, resource, Resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IRestMessage from '../../../modelos/IRestMessage';
import IPlato from '../../../modelos/Interfaces/IPlato';
import { PlatitoComponent } from './platitoComponent/platito.component';

@Component({
  selector: 'app-plato',
  imports: [PlatitoComponent],
  templateUrl: './plato.component.html',
  styleUrl: './plato.component.css'
})
export class PlatoComponent {
  //#region-----servicios------------
  private _activatedRoute = inject(ActivatedRoute)
  private _injector = inject(Injector)
  //#endregion

  private _pathTipo = signal<string>(this._activatedRoute.snapshot.paramMap.get('pathTipo') as string);

  private _platosResource: Resource<IRestMessage> = resource(
    {
      request: this._pathTipo,
      loader: async ({ request, abortSignal, previous }) => {
        console.log('valor del resource donde van los platos, ', request, abortSignal, previous);
        let _resp = await fetch(
          `http://localhost:3003/api/Restaurante/Platos?pathTipo=${this._pathTipo()}`,
          { method: 'GET', signal: abortSignal }
        );
        let _body = await _resp.json();
        return _body ?? { codigo: 400, mensaje: 'recuperando platos de node' }
      },
      injector: this._injector
    }
  );
  public platos = computed<IPlato[]>(() => this._platosResource.value().codigo == 0 ? this._platosResource.value().datos : []);
}
