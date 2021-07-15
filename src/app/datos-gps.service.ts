/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosGPSService {

  // clave - valor con las coordenadas. Más adelante, lo haré observable para que se puede emitir por toda la app
  // formato de watchCoordenadas:
  // {
  //   latitud: coordenadas.coords.latitude,
  //   longitud: coordenadas.coords.longitude
  // }

  watchCoordenadas: any = {};
  posicion: any;

  //numberSource guarda el valor y variableGlobal se encarga del flujo de datos mediante observable.
  //los diferentes componentes que quieran recibir los cambios deben subscriberse a esta variable
  private posSource = new BehaviorSubject(this.watchCoordenadas);
  coordenadasObser = this.posSource.asObservable();

  constructor(private zone: NgZone) { }

  // Para obtener posición actual getCurrentPosition o watchPosition

  // getPosition cada vez que se llama devuelve la posición actual. Si se requiere actualizar ubicación
  // a tiempo real mejor usar watchPosition.


  // este método lo llamo una vez para obtener ubicación inicial
  // lio enorme de await async, suerte del quickfix del vscode que fue corrigiendo el dódigo
  getLocation() {
    return new Promise(async resolve => {
      const coordenadas = Geolocation.getCurrentPosition();
      this.posicion = {
        latitud: (await coordenadas).coords.latitude,
        longitud: (await coordenadas).coords.longitude
      };
      resolve(this.posicion);
    }
    );
  }

  //método mágico que cada 5 segundos aprox. 5 segundos actualiza posición
  // cuando se llama una sola vez se pone a la escucha del gps
  // si además hacemos observable watchCoordenadas ya tenemos la ubicación accesible desde toda la app
  // el argumento de las primeras llaves puede contener
  // enableHighAccuracy 	por defecto false, true es más preciso pero tiene alto consumo de batería
  // timeout por defecto 10000 tiempo en milisegundos que si no recibe datos dará un error,
  // maximumAge por defecto 0 ¿¿?? ver docu oficial, no acabo de entenderlo
  watchPosition() {
    const watch = Geolocation.watchPosition({}, (coordenadas, err) => {
      this.zone.run(() => {
        this.watchCoordenadas = {
          latitud: coordenadas.coords.latitude,
          longitud: coordenadas.coords.longitude
        };

        // nuevo valor para emitir que recibiran los subscritos
        this.posSource.next(this.watchCoordenadas);
      });
    });
  } catch(e) {
    console.error(e);
  }
}
