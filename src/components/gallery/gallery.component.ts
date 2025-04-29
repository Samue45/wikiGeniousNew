import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { catchError, forkJoin } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent  implements OnInit {

  private arrayNamesGenious: string [] = [];
  private arrayPhotosGenious : string [] = [];

  constructor(private apiService : ApiService) {}

  ngOnInit() {
    // Con este método obtenemos todas las URL asociadas a cada foto de cada genio y sus nombres
    this.getAllPhotosAndNames();
  }

  getAllPhotosAndNames(){
  // Llamamos a getListNames y después de que se obtengan los nombres, ejecutamos getPhotos
  this.getListNames().subscribe({
    next: ({ math, physic, informatic }) => {
      // Tengo que modificar los nombres obtenidos , ya que devuelve Categoría:Nombre del genio
      // (...) Nos permite descomponer un array en objetos individuales 
      this.arrayNamesGenious = [
        ...math.map(name => name.replace("Categoría:", "").trim()),
        ...physic.map(name => name.replace("Categoría:", "").trim()),
        ...informatic
      ];
      
      // Ahora que los nombres están disponibles, obtenemos las fotos
      this.getPhotos();
    },
    error: (err) => {
      console.error('Error al obtener los nombres de los genios:', err);
    }
  });

  }

  getListNames() {
// Usamos forkJoin para hacer las solicitudes de manera simultánea
    return forkJoin({
      math: this.apiService.getNamesMathGenious(),
      physic: this.apiService.getNamesPhysicGenious(),
      informatic: this.apiService.getNamesInformaticGenious()
    }).pipe(
      catchError((err) => {
        console.error('Error al obtener los nombres:', err);
        return of({ math: [], physic: [], informatic: [] }); // Retornamos arrays vacíos en caso de error
      })
    );
  }

  getPhotos() {
    
    // Si no tenemos nombres, salimos de la función
    if (this.arrayNamesGenious.length === 0) {
      console.log('No hay nombres para cargar fotos');
      return;
    }
    // Creamos un array de observables para obtener las fotos de los genios
    const arrayObservable = this.arrayNamesGenious.map((name) => {
      return this.apiService.getImage(name).pipe(
        catchError((err) => {
          console.log('Error al obtener la foto del genio:', name, err);
          return of(null); // En caso de error, devolvemos null
        })
      );
    });

    // Usamos forkJoin para esperar que todas las solicitudes de imágenes se resuelvan
    forkJoin(arrayObservable).subscribe({
      next: (photos) => {
        photos.forEach((photoUrl, index) => {
          if (photoUrl) { // Solo agregamos URLs válidas (no null)
            this.arrayPhotosGenious.push(photoUrl);
          } else {
            console.log(`${this.arrayNamesGenious[index]} no tiene foto en la base de datos`);
          }
        });
      },
      error: (err) => {
        console.log('Hubo un error al obtener las fotos:', err);
      }
    });
  }

  getArrayNamesGenious() : string [] {
    return this.arrayNamesGenious;
  }

  getArrayPhotosGenious() : string [] {
    return this.arrayPhotosGenious;
  }
}