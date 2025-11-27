import { ResolveFn } from '@angular/router';
import { catchError, from, of } from 'rxjs';
import IRestMessage from '../modelos/IRestMessage';


export const platosResolver: ResolveFn<IRestMessage> = (route, state) => {
  const pathTipo = route.paramMap.get('pathTipo') as string;
  
  return from(
    fetch(`http://localhost:3003/api/Restaurante/Platos?pathTipo=${pathTipo}`)
      .then(resp => resp.json())
      .then(body => body ?? { codigo: 400, mensaje: 'Error recuperando platos', datos: [] })
  ).pipe(
    catchError(error => {
      console.error('Error cargando platos:', error);
      return of({ 
        codigo: 400, 
        mensaje: 'Error en la petición', 
        datos: [] 
      } as IRestMessage);
    })
  );
};