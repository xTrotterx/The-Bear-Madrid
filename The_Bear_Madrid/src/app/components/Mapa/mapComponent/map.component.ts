import { Component, OnDestroy, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy{

  //#region----propiedades--------
  private _accessToken: string = 'pk.eyJ1IjoieHRyb3R0ZXJ4IiwiYSI6ImNtaDh6dHRmNTE3Z2kyanBnY2pjOWg1aGkifQ.SF2nKkiE6Eq4cNxHBXZzlQ';

  //coordenadas 
  private _long: number = -3.6894651276835533;
  private _lat: number = 40.42156473252101;

  private _zoom: number = 15;

  private _map?: mapboxgl.Map;
  private _marker?: mapboxgl.Marker;
  private _nombreMarker: string = 'Ubicacion';
  //#endregion

  //#region------metodos-----

  ngOnInit():void {
    this.InitMap();
  }
  ngOnDestroy():void {
  this._map?.remove();
  }

  private InitMap(): void {
    //configuracion del token
    (mapboxgl as any).accessToken = this._accessToken;

    this._map = new mapboxgl.Map(
      {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this._long, this._lat],
        zoom: this._zoom
      }
    );
    //con esto meto los botones para controlar el mapa a parte de que se puede con el raton 
    this._map.addControl(new mapboxgl.NavigationControl());

    //esto es para poner un marcador
    this._marker = new mapboxgl.Marker({ color: '#FF0000' })
                               .setLngLat([this._long, this._lat])
                               .setPopup(new mapboxgl.Popup({ offset: 25 })
                               .setHTML(`<h3>${this._nombreMarker}</h3>`))
                               .addTo(this._map);
  }

  //#endregion
}
