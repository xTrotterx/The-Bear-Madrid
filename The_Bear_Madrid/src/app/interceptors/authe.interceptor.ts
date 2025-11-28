import { HttpEvent, HttpHeaderResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../app.config';
import { inject } from '@angular/core';
import IJwt from '../modelos/IJwt';
import { catchError, map, tap, throwError } from 'rxjs';

import { RestClienteService } from '../servicios/rest-cliente.service';
import IRestMessage from '../modelos/IRestMessage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _storageSvc = inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
  const _restCliente = inject(RestClienteService);

  const _jwts: IJwt = _storageSvc.getJWT();

  let _authreq = req;
  console.log('objeto peticion antes de clonar ', req);

  if (_jwts.sesion !== '' || _jwts.verificacion !== '') {

    _authreq = req.clone(
      {
        headers: req.headers.append('Authorization', `Bearer ${_jwts.sesion !== '' ? _jwts.sesion : _jwts.verificacion}`)
      }
    );

    console.log('objeto peticion despues de clonar ', _authreq);
  }

  return next(_authreq).pipe(
    tap((evento: HttpEvent<any>) => console.log('valor del observable capturado por el interceptor...', evento)),
    catchError((error: any) => {
      console.log('error en respueta en observable peticion request saliente... ', error);
      
      if (error.status == 403) {

        const _refresh = _jwts?.refresh;
        if (!_refresh) return throwError(() => new Error('no existe refreshtoken'))

        _restCliente.RefrescarTokens(_refresh).pipe(
          tap((resp: IRestMessage) => console.log('evento interceptado en interceptor en observable peticion RefrescarTokens: ', resp)),
          map((resp: IRestMessage) => {
            if (resp.codigo == 0) {
              //tengo nuevos jwt de sesion y refresh, mando peticion original del cliente con nuevo jwt-sesion
              let _retryreq = req.clone(
                {
                  setHeaders: { Authorization: `Bearer ${resp.datos!.sesion}` }
                }
              );
              return next(_retryreq);

            } else {
              //ha ido mal la generacion de nuevos tokens...al login directamente...
              return throwError(() => new Error('fallo en regeneracion de token de sesion a partir del refresh-token'))
            }
          })

        )

      }

      return throwError(() => new Error('error recibido desde nodejs...' + error))

    }
    )
  );
};
