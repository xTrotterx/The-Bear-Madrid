import { Component, Input } from '@angular/core';
import IOpinion from '../../../modelos/Interfaces/IOpinion';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-opinion-component',
  imports: [DatePipe],
  templateUrl: './opinion.component.html',
  styleUrl: './opinion.component.css'
})
export class OpinionComponent {
  
  @Input() opinion!: IOpinion;
public getPuntuacionColor(puntuacion: number): string {
    if (puntuacion >= 4) return '#28a745'; // Verde - Excelente
    if (puntuacion >= 3) return '#ffc107'; // Amarillo - Bueno
    if (puntuacion >= 2) return '#fd7e14'; // Naranja - Regular
    return '#dc3545'; // Rojo - Malo
  }
}
