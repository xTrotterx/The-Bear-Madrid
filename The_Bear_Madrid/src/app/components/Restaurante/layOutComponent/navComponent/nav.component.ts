import { Component, computed, ElementRef, inject, Injector, resource, ResourceRef, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../../app.config';
import IUsuario from '../../../../modelos/Interfaces/IUsuario';
import ITipos from '../../../../modelos/Interfaces/ITipos';
import { RestClienteService } from '../../../../servicios/rest-cliente.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import IRestMessage from '../../../../modelos/IRestMessage';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterModule, NgClass],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  //#region---------servicios---------
  private _injector = inject(Injector);
  private _router = inject(Router);
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  private _restSvc = inject(RestClienteService);
  //#endregion

  //#region---------propiedades-------
  public breadCrumb = signal<ITipos[]>([{ nombreTipo: 'Atrás', pathTipo: 'raiz' }]);
  public tipo = signal<ITipos | null>(null);

  public datosUsuario = computed<IUsuario  | undefined>(() => this._storageGlobal.getDatosUsuario());

  public btnCerrar = viewChild<ElementRef>('btnCerrar');

  //funcion resource para recuperar los tipos de platos
  public _tipoResource: ResourceRef<IRestMessage> = resource(
    {
      request: this.tipo,
      loader: async ({ request, abortSignal, previous }) => {
        console.log('valor del resource donde van los tipos, ', request, abortSignal, previous);
        let _pathTipo = this.tipo()?.pathTipo || 'raiz';
        let _resp = await fetch(
          `http://localhost:3003/api/Restaurante/Tipos?pathTipo=${_pathTipo}`,
          { method: 'GET', signal: abortSignal }
        );
        let _body = await _resp.json();
        return _body ?? { codigo: 400, mensaje: 'recuperando tiops de platos' }
      },
      injector: this._injector
    }
  );
  public tipos = computed<ITipos[]>(() => this._tipoResource.value() ? (this._tipoResource.value().codigo == 0 ? this._tipoResource.value().datos : []) : []);

  //#endregion
  //#region -------metodos---------------------
  public InnitTipos() {
    this.tipo.set(null);
    this.breadCrumb.set([{ nombreTipo: 'Atrás', pathTipo: 'raiz' }]);
  }

  public RecuperarSubTipo(tip: ITipos) {
  // actualizar breadcrumb 
  this.breadCrumb.update((prev: ITipos[]) => {
    let _pos = prev.findIndex(tipoo => tipoo.pathTipo == tip.pathTipo);
    return _pos == -1 ? [...prev, tip] : prev.slice(0, _pos + 1);
  });

  // comprobar si es un tipo final
  if (tip.esFinal) {
    // es un subtipo final, navegar a platos y cerrar el menú
    this.btnCerrar()?.nativeElement.click();
    this._router.navigate(['/Restaurante/Platos', tip.pathTipo]);
    // no se si reinciarlo 
    // this.InnitTipos();
  } else {
    // si no es subtipo final, actualizo el tipo para cargar subcategorías
    this.tipo.set(tip);
  }
}
 public cerrarSesion(){
  this._storageGlobal.LogOut();
  console.log('usuarioo...', this.datosUsuario());
 }
  //#endregion

}
