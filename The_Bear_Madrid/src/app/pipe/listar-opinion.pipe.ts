import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarOpinion'
})
export class ListarOpinionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
