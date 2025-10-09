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
  public RegistroCliente(datos: any): Signal<IRestMessage> {
    return toSignal(
      this._httpClient.post<IRestMessage>('http://localhost:3003/api/zonaCliente/Registro',
        datos,
        { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }
      ).pipe(
        startWith({ codigo: 100, mensaje: 'esperando respuesta del server...' })
      ),
      { injector: this._injector, requireSync: true }
    );
  }

  public LoginCliente(datos: any): Signal<IRestMessage> {
    return toSignal(
      this._httpClient.post<IRestMessage>('http://localhost:3003/api/zonaCliente/Login',
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
        'http://localhost:3003/api/zonaCliente/RefrescarTokens',
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
}
