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

  private arrayNamesGenious: string [];

  constructor(private apiService : ApiService) {
    this.arrayNamesGenious = [];
   }

  ngOnInit() {}

  createGallery(){
    // Obtenemos los nombres de las diferentes categorias y lo almacenamos en un array
    const arrayNamesGenious: string[] = [];
    this.getListNames(arrayNamesGenious)

    // Array para guardar todas las fotos
    const arrayPhotosGenious: string[] = [];

    // Recorremos el array,para obtener la foto y crear el contenedor especial por cada genio
    


  }

  getListNames(arrayNamesGenious: string[]) {
    // El método forkJoin nos permite suscribirnos a varios Observables a la vez y terminará cuando los haya procesado todos
    forkJoin({
      math: this.apiService.getNamesMathGenious(),
      physic: this.apiService.getNamesPhysicGenious(),
      informatic: this.apiService.getNamesInformaticGenious()
    }).subscribe({
      next: ({ math, physic, informatic }) => {
        // Tengo que modificar los nombres obtenidos , ya que devuelve Categoría:Nombre del genio
        // (...) Nos permite descomponer un array en objetos individuales 
        arrayNamesGenious.push(...math.map(name => name.replace("Categoría:", "").trim()));
        arrayNamesGenious.push(...physic.map(name => name.replace("Categoría:", "").trim()));
        arrayNamesGenious.push(...informatic);
      },
      error: (err) => {
        console.error('Error al obtener los nombres:', err);
      }
    });
  }

  getPhotos(arrayNamesGenious: string[], arrayPhotosGenious: string[]){
    // 1º Creamos un array con todos los Observables obtenidos, para luego suscribirnos a ellos
    // map nos devuelve un nuevo array
    const arrayObservable = arrayNamesGenious.map(name => {
      return this.apiService.getImage(name).pipe(
        catchError(err => {
          console.log("Error al obtener la foto del genio : " + name, err);
          return of(null); // Si hay error, devolvemos null en lugar de interrumpir el flujo  
        })
      );
    })

    // 2º Recorremos dicho array y esperamos a que se resuelvan todas las solicitude HTTP
    forkJoin(arrayObservable).subscribe(
      {
        // Cuando todas los Ovservable han sido resueltas, obtenemos un array con las URL de las fotos
        next: (photos) => {
          // 'photos' es un array con todas las respuestas (pueden ser URLs o null)
          photos.forEach((photoUrl, index) => {
            if (photoUrl !== null) {
              arrayPhotosGenious.push(photoUrl);
            } else {
              console.log(arrayNamesGenious[index] + " no tiene foto en la base de datos");
            }
          });
        },
        error : (err ) => {
          console.log("Hubo un error al hacer las solicitudes:", err);
        }
      }
    )

  }

}
