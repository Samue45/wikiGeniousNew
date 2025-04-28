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

  // Necesito optener las fotos de todos los genios y por cada 
  // imagen generar su propio mini contenedor

  // 1º Llamar a los métodos que me devuelven los nombres de los genios
  // 2º Crear un array propio con todos los nombres (sin importar la categoría)
  // 3º Recorrer el array y por cada nombre obtener la foto del genio y crear su contenedor personalizado

  createArrayOfNames(){
    // Obtenemos los nombres de las diferentes categorias
    const arrayNamesMath: string[] = [];
    const arrayNamePhysic: string[] = [];
    const arrayNameInformatic: string[] = [];

    this.getListNames(arrayNamesMath,arrayNamePhysic,arrayNameInformatic)


    //1º Obtener los nombres de todos los matemáticos
    // Tengo que modificar los nombres obtenidos , ya que devuelve Categoría:Nombre del genio



  }

  getListNames(arrayNamesMath: string[], arrayNamePhysic: string[], arrayNameInformatic: string[]) {
    forkJoin({
      math: this.apiService.getNamesMathGenious(),
      physic: this.apiService.getNamesPhysicGenious(),
      informatic: this.apiService.getNamesInformaticGenious()
    }).subscribe({
      next: ({ math, physic, informatic }) => {
        // Modificar y agregar los nombres
        arrayNamesMath.push(...math.map(name => name.replace("Categoría:", "").trim()));
        arrayNamePhysic.push(...physic.map(name => name.replace("Categoría:", "").trim()));
        arrayNameInformatic.push(...informatic.map(name => name.replace("Categoría:", "").trim()));
        console.log(arrayNamesMath, arrayNamePhysic, arrayNameInformatic);
      },
      error: (err) => {
        console.error('Error al obtener los nombres:', err);
      }
    });
  }

}
