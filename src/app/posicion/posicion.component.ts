import { Component, OnInit } from '@angular/core';
import { DatosGPSService } from '../datos-gps.service';

@Component({
  selector: 'app-posicion',
  templateUrl: './posicion.component.html',
  styleUrls: ['./posicion.component.scss'],
})
export class PosicionComponent implements OnInit {


  pos: any; // variable local subscrita a la variable observable del servicio

  constructor(private datosGPSService: DatosGPSService) {
    // en el componente me subscribo al observable quu emite la posición. La variable n recibe coordenadas que asigno
    // a la variable local del componente. Esta será la que muestre el template de manera reactiva por interpolación
    this.datosGPSService.coordenadasObser.subscribe(n => {
      this.pos = n;
    });

  }

  ngOnInit() {
    //arranca escucha del GPS
    this.datosGPSService.watchPosition();
  }
}




