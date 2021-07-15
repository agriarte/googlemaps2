/* eslint-disable @typescript-eslint/member-ordering */
import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DatosGPSService } from '../datos-gps.service';

//si no reconoce google declararla previamente
declare const google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  pos: any; // variable local subscrita a la variable observable del servicio. contiene ubicación

  //parecido a getElementbyId. En la vista HTML se refiere a #map no al id.
  @ViewChild('map', { static: true }) mapElement: ElementRef;

  map: any;
  miMarker: any; // marker con mi ubicacion

  constructor(private datosGPSService: DatosGPSService) {

  }
  async ngOnInit() {
    //llamada a get location para loadMapa cuando hay ubicacion disponible
    //por await - async y promesa el flujo se espera aquí hasta recibir datos
    this.pos = await this.datosGPSService.getLocation();

    //cuando recibo geolocation sigue flujo
    //cargo mapa en posicion aproximada
    this.loadMap(this.pos);

    //arranca escucha del GPS
    this.datosGPSService.watchPosition();


    // en el componente me subscribo al observable quu emite la posición. La variable n recibe coordenadas que asigno
    // a la variable local del componente. Esta será la que muestre el template de manera reactiva por interpolación
    this.datosGPSService.coordenadasObser.subscribe(n => {
      this.pos = n;
      // cada 5s entro aquí. Buen sitio para actualizar marker con mi posición
      this.moverMarker(this.pos);
    });

  }


  loadMap(coordenadas) {
    const latLng = new google.maps.LatLng(
      coordenadas.latitud,
      coordenadas.longitud
    );
    const mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(this.map);
  }

  addMarker(map) {
    const svgMarker = {
      // eslint-disable-next-line max-len
      path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
      fillColor: 'blue',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };
    this.miMarker = new google.maps.Marker({
      map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      icon: svgMarker
    });
  }

  moverMarker(pos) {
    const latlng = new google.maps.LatLng(pos.latitud, pos.longitud);
    this.miMarker.setPosition(latlng);
  }
}
