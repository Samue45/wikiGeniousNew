import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { forkJoin } from 'rxjs';

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
    forkJoin({
      math: this.apiService.getNamesMathGenious(),
      physic: this.apiService.getNamesPhysicGenious(),
      informatic: this.apiService.getNamesInformaticGenious()
    }).subscribe({
      next: ({ math, physic, informatic }) => {
        // Tengo que modificar los nombres obtenidos , ya que devuelve Categoría:Nombre del genio
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
    // Aquí hacemos la petición de las fotos de cada genio y las almacenamos en un array
  }

}
