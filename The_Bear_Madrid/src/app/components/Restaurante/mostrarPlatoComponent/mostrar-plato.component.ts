import { Component, computed, inject, Injector, Resource, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IRestMessage from '../../../modelos/IRestMessage';
import IPlato from '../../../modelos/Interfaces/IPlato';
import { ListarOpinionPipe } from '../../../pipe/listar-opinion.pipe';
import IOpinion from '../../../modelos/Interfaces/IOpinion';
import IUsuario from '../../../modelos/Interfaces/IUsuario';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../../../app.config';
import { OpinionComponent } from '../opinionComponent/opinion.component';
import Swal from 'sweetalert2';
import { ModalOpinionComponent } from '../opinionComponent/modalOpinionComponent/modal-opinion.component';

@Component({
  selector: 'app-mostrar-plato',
  imports: [ListarOpinionPipe, OpinionComponent, ModalOpinionComponent],
  templateUrl: './mostrar-plato.component.html',
  styleUrl: './mostrar-plato.component.css'
})
export class MostrarPlatoComponent {
  //#region-------------servicios-----------------
  private _injector = inject(Injector);
  private _activatedRoute = inject(ActivatedRoute);
  private _storageGlobal = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  //#endregion

  //#region------------propiedades----------------
  public datosUsuario = computed<IUsuario | undefined>(()=>this._storageGlobal.getDatosUsuario());
  private _idPlato = signal<string>(this._activatedRoute.snapshot.paramMap.get('idPlato') as string);

  public esFavorito = signal(false);

  estrellas() { return [1, 2, 3, 4, 5] }
  //para listar las opiniones y usando la pipe 
  public _opciones = signal<'fecha' | 'puntuacion' | 'todas'>('todas');

  //#region------------metodos--------------------
  private _platoResource: Resource<IRestMessage> = resource(
    {
      request: this._idPlato,
      loader: async ({ request, abortSignal, previous }) => {
        console.log('valor de la señal del id: ', this._idPlato())
        let _resp = await fetch(
          `http://localhost:3003/api/Restaurante/Plato?idPlato=${this._idPlato()}`,
          { method: 'GET', signal: abortSignal }
        );
        let _body = await _resp.json();
        console.log('plato con opiniones', _body);
        return _body ?? { codigo: 400, mensaje: 'error al recuperar el plato' }
      },
      injector: this._injector
    }
  );

  public plato = computed<IPlato>(() => {
    let _resp = this._platoResource.value();
    if (_resp?.codigo !== 0) return null;
    return _resp.datos;
  });

  public opiniones = computed<IOpinion[]>(() => {
    return this.plato()?.valoraciones ?? [];
  });

  //estrellitas
  private _valoracionMedia = computed(() => {
    let _plato = this.plato();
    if (!_plato?.valoraciones?.length) return 0; //-- explicacion de esta mierda porque antes me daba error al hacer === 0: de esta forma es directamente falso o undefined/null me cago en tu madre typescript
    let _suma = _plato.valoraciones.reduce((acc, valoracion) => acc + (valoracion.estrellas ?? 0), 0);
    return _suma / _plato.valoraciones.length;
  });

  public _valoracionHecha = computed(() => {
    let _aaa= this.datosUsuario()?.opiniones.find(opinion => opinion.idPlato === this._idPlato()) //me devuelve solo true, no el objeto d ela opinion entera porque no lo necesito
    console.log('id del cliente en la valoracion hecha....', _aaa);
    return _aaa
  })
  valoracionRedondeada() {
    return Math.round(this._valoracionMedia());
  }

  //boton para añadirlo me gusta del usuario
  toggleFavorito() {
    this.esFavorito.set(!this.esFavorito());

  }

  public cambiarOpcion(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this._opciones.set(select.value as 'fecha' | 'puntuacion' | 'todas');
  }

  public intentarOpinar() {
    if (!this.datosUsuario()) {
      Swal.fire({
        icon: 'info',
        title: '¡Ups!',
        text: 'Necesitas tener una cuenta para dejar tu opinión',
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#ad0011'
      });
      return;
    }
    if (this._valoracionHecha()) {
      Swal.fire({
        icon: 'info',
        title: 'Ya has valorado este plato',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ad0011'
      })
    }

  }

   public recargarPlato() {
    console.log('Recargando opiniones del plato...');
    //recargo la llamada a la bd
    this._platoResource.reload();
  }
  //#endregion
}
