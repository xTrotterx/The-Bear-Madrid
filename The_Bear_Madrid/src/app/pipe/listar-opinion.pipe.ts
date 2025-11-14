import { Pipe, PipeTransform } from '@angular/core';
import IOpinion from '../modelos/Interfaces/IOpinion';

@Pipe({
  name: 'listarOpinion'
})
export class ListarOpinionPipe implements PipeTransform {

  transform( opiniones: IOpinion[] = [], criterio: 'fecha' | 'puntuacion' | 'todas' = 'todas'): IOpinion[] {
    if (!opiniones?.length) return [];

    const _opinionesArray = [...opiniones];

    switch (criterio) {
      case 'fecha':
        return _opinionesArray.sort((a, b) =>
          (b.fecha ?? '') > (a.fecha ?? '') ? 1 : -1
        );

      case 'puntuacion':
        return _opinionesArray.sort((a, b) =>
          (b.estrellas ?? 0) - (a.estrellas ?? 0)
        );
      case 'todas':
      default:
        return _opinionesArray;
    }
  }

}
