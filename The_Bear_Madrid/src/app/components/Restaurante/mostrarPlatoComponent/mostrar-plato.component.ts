import { Component, computed, effect, inject, Injector, Resource, resource, signal, untracked } from '@angular/core';
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
import { RestClienteService } from '../../../servicios/rest-cliente.service';

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
  private _restSvc: RestClienteService = inject(RestClienteService);
  //#endregion

  //#region------------propiedades----------------
  public datosUsuario = computed<IUsuario | undefined>(() => this._storageGlobal.getDatosUsuario());
  private _idPlato = signal<string>(this._activatedRoute.snapshot.paramMap.get('idPlato') as string);

  //con esto hago directamente que si esta logueado el usuario y es fav me aparezca marcado
  public esFavorito = computed(() => {
    let usuario = this.datosUsuario();
    if (!usuario?.favoritos) return false;
    return usuario.favoritos.some((fav: any) => fav === this._idPlato());
  });

  estrellas() { return [1, 2, 3, 4, 5] }
  //para listar las opiniones y usando la pipe 
  public _opciones = signal<'fecha' | 'puntuacion' | 'todas'>('todas');

  //pillo del store la cantidad que hay ya
  public numPlatos = computed(() => {
    let order = this._storageGlobal.getOrder();
    let item = order.items.find(it => it.plato._id === this._idPlato());
    return item ? item.cantidad : 0;
  });

  //#region------------metodos--------------------
  private _platoResource: Resource<IRestMessage> = resource(
    {
      request: () => this._idPlato(),
      loader: async ({ request, abortSignal, previous }) => {
        console.log('valor de la señal del id: ', this._idPlato())
        let _resp = await fetch(
          `http://localhost:3003/api/Restaurante/Plato?idPlato=${request}`,
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
    let _aaa = this.datosUsuario()?.opiniones.find(opinion => opinion.idPlato === this._idPlato()) //me devuelve solo true, no el objeto d ela opinion entera porque no lo necesito
    console.log('id del cliente en la valoracion hecha....', _aaa);
    return _aaa
  })
  valoracionRedondeada() {
    return Math.round(this._valoracionMedia());
  }

  //boton para añadirlo me gusta del usuario
  toggleFavorito() {
    let _usuario = this.datosUsuario();
    if (!_usuario) {
      Swal.fire({
        icon: 'info',
        title: '¡Ups!',
        text: 'Necesitas iniciar sesión para guardar favoritos',
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#ad0011'
      });
      return;
    }

    const marcar = this._restSvc.ActualizarFavoritos(_usuario._id, this._idPlato());

    // Esperar a que la señal tenga un valor diferente de 100
    const resp = marcar();

    effect(() => {
      const resp = marcar();

      if (resp.codigo === 0) {
        console.log('Favoritos actualizados:', resp.datos);
        //con esto evito que vuelva a ejecutarse el efecto y asi evito bucle cuando la señal cambie
        untracked(() => {
          this._storageGlobal.setDatosUsuario({
            ..._usuario,
            favoritos: resp.datos
          });
          console.log('lista de favoritos del usuario: ', this.datosUsuario()?.favoritos);
        });
      }
    }, { injector: this._injector });
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
  public addToOrder() {
    let _plato = this.plato();
    if (!_plato) {
      console.error('No hay plato disponible');
      return;
    }

    this._storageGlobal.setItemsOrder('sumar', {
      plato: _plato,
      cantidad: 1
    });
  }

  public modificarCantidad(operacion: 'sumar' | 'restar') {
    let _plato = this.plato();
    if (!_plato) return;

    if (operacion === 'sumar') {
      this._storageGlobal.setItemsOrder('sumar', {
        plato: _plato,
        cantidad: 1
      });
    } else if (operacion === 'restar') {
      let cantidadActual = this.numPlatos();

      if (cantidadActual === 1) {
        this._storageGlobal.setItemsOrder('eliminar', {
          plato: _plato,
          cantidad: 0
        });
      } else if (cantidadActual > 1) {

        this._storageGlobal.setItemsOrder('restar', {
          plato: _plato,
          cantidad: cantidadActual - 1
        });
      }
    }
  }

  public recargarPlato() {
    console.log('Recargando opiniones del plato...');
    this._platoResource.reload();
  }
  //#endregion
}
