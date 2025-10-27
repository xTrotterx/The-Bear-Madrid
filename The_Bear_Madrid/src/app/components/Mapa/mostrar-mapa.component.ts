import { Component } from '@angular/core';
import { MapComponent } from "./mapComponent/map.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mostrar-mapa',
  imports: [ MapComponent],
  templateUrl: './mostrar-mapa.component.html',
  styleUrl: './mostrar-mapa.component.css'
})
export class MostrarMapaComponent {

}
