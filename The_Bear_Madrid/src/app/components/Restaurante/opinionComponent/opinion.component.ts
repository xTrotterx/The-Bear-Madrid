import { Component, Input } from '@angular/core';
import IOpinion from '../../../modelos/Interfaces/IOpinion';

@Component({
  selector: 'app-opinion-component',
  imports: [],
  templateUrl: './opinion.component.html',
  styleUrl: './opinion.component.css'
})
export class OpinionComponent {
  
  @Input() opinion!: IOpinion;

}
