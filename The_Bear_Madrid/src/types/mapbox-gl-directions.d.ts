declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
  import { IControl, Map } from 'mapbox-gl';

  export interface DirectionsOptions {
    accessToken: string;
    unit?: 'imperial' | 'metric';
    profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling' | 'mapbox/driving-traffic';
    alternatives?: boolean;
    congestion?: boolean;
    controls?: {
      inputs?: boolean;
      instructions?: boolean;
      profileSwitcher?: boolean;
    };
    interactive?: boolean;
    language?: string;
    placeholderOrigin?: string;
    placeholderDestination?: string;
    flyTo?: boolean;
    styles?: any[];
  }

  export default class MapboxDirections implements IControl {
    constructor(options: DirectionsOptions);
    
    onAdd(map: Map): HTMLElement;
    onRemove(): void;
    
    setOrigin(origin: [number, number] | string): this;
    setDestination(destination: [number, number] | string): this;
    removeRoutes(): this;
    getOrigin(): any;
    getDestination(): any;
  }
}