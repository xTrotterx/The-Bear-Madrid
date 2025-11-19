import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Injector, Signal } from '@angular/core';
import IRestMessage from '../modelos/IRestMessage';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, startWith, tap } from 'rxjs';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class RestClienteService {
  private _httpClient = inject(HttpClient);
  private _injector = inject(Injector);
  private _storage = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);

  constructor() { }

  //#region-----------metodos-----------------
  public RegistroUsuario(datos: any): Signal<IRestMessage> {
    return toSignal(
      this._httpClient.post<IRestMessage>('http://localhost:3003/api/Usuario/Registro',
        datos,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).pipe(
        startWith({ codigo: 100, mensaje: 'esperando respuesta del server...' })
      ),
      { injector: this._injector, requireSync: true }
    );
  }

  public LoginCliente(datos: any): Signal<IRestMessage> {
    return toSignal(
      this._httpClient.post<IRestMessage>('http://localhost:3003/api/Usuario/Login',
        datos,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).pipe(
        startWith({ codigo: 100, mensaje: 'esperando respuesta del server....' })
      ),
      { injector: this._injector, requireSync: true }
    );
  }

  public RefrescarTokens(refreshToken: string): Observable<IRestMessage> {
    return this._httpClient
      .post<IRestMessage>(
        'http://localhost:3003/api/Usuario/RefrescarTokens',
        { refreshToken },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json ' }) }
      )
      .pipe(
        tap(
          (resp: IRestMessage) => {
            //si la respuesta del servicio de nodejs tiene codigo 0, en datos van el accesstoken y el refresh nuevos actualizados...los almaceno
            //en servicio
            this._storage.setJWT('sesion', resp.datos.sesionjwt);
            this._storage.setJWT('refresh', resp.datos.refreshjwt);
          }
        )
      )
  }

  public GuardarOpinion(datos: any): Signal<IRestMessage> {
    return toSignal
      (this._httpClient.post<IRestMessage>('http://localhost:3003/api/Restaurante/GuardarOpinion',
        datos,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).pipe(
        startWith({ codigo: 100, mensaje: 'esperando respuesta del server para guardar la opinion...' })
      ),
        { injector: this._injector, requireSync: true }
      );
  }

  public ActualizarFavoritos(idUser: any, idPlato: any): Signal<IRestMessage> {
    return toSignal(
      this._httpClient.post<IRestMessage>(
        'http://localhost:3003/api/Usuario/ActualizarFav',
        { idUser, idPlato },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      ).pipe(
        startWith({ codigo: 100, mensaje: 'actualizando favoritos....' })
      ),
      { injector: this._injector, requireSync: true }
    )
  }
}
