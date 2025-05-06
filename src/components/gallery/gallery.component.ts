import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { catchError, forkJoin, map } from 'rxjs';
import { of } from 'rxjs';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MiniCardGeniousComponent } from '../mini-card-genious/mini-card-genious.component';
import { GeniousCategory } from 'src/app/models/GeniousCategory ';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports : [NgFor, CommonModule , IonHeader, IonToolbar, IonTitle,  IonGrid, IonRow, IonCol , MiniCardGeniousComponent]
})
export class GalleryComponent  implements OnInit {

  // Usamos un solo array de objetos para contener tanto el nombre como la foto
  private geniousData: { name: string, category: number, photoUrl: string | null }[] = [];
  private filteredGeniousData: { name: string, category: number, photoUrl: string | null }[] = [];
  
  constructor(private apiService : ApiService) {}

  ngOnInit() {
    // Con este método obtenemos todas las URL asociadas a cada foto de cada genio y sus nombres
    this.getAllPhotosAndNames();
  }

  getAllPhotosAndNames() {
    this.getListNames().subscribe({
      next: ({ math, physic, informatic }) => {
        // Procesamos los nombres, y después obtenemos las fotos
        const allNames = [
          ...math.map(genious => ({
            ...genious,
            name: genious.name.replace("Categoría:", "").trim()
          })),
          ...physic.map(genious => ({
            ...genious,
            name: genious.name.replace("Categoría:", "").trim()
          })),
          ...informatic
        ];

        // Ahora obtenemos las fotos
        this.getPhotos(allNames);
      },
      error: (err) => {
        console.error('Error al obtener los nombres de los genios:', err);
      }
    });
  }

  getListNames() {
    // Hacemos solicitudes simultáneas para obtener los nombres de los genios
    return forkJoin({
      math: this.apiService.getNamesMathGenious(),
      physic: this.apiService.getNamesPhysicGenious(),
      informatic: this.apiService.getNamesInformaticGenious()
    }).pipe(
      catchError((err) => {
        console.error('Error al obtener los nombres:', err);
        return of({ math: [], physic: [], informatic: [] }); // En caso de error, devolvemos arrays vacíos
      })
    );
  }

  getPhotos(allNames: { name: string; category: number }[]) {
    // Si no hay nombres, salimos de la función
    if (allNames.length === 0) {
      console.log('No hay nombres para cargar fotos');
      return;
    }

    // Creamos los observables para obtener las fotos de los genios
    const arrayObservable = allNames.map((genio) =>
      this.apiService.getImage(genio.name).pipe(
        catchError((err) => {
          console.log('Error al obtener la foto del genio:', genio.name, err);
          return of(null); // Si hay error, devolvemos null
        })
      )
    );

    // Esperamos que todas las solicitudes se resuelvan usando forkJoin
    forkJoin(arrayObservable).subscribe({
      next: (photos) => {

        // Combinamos los nombres con las fotos
        this.geniousData = allNames.map((genio, index) => ({
          name: genio.name,
          category: genio.category,
          photoUrl: photos[index] || null
        }));

        this.filteredGeniousData = [...this.geniousData]; // Inicializamos el array para filtrar los genios
      },
      error: (err) => {
        console.log('Hubo un error al obtener las fotos:', err);
      }
    });
  }

  searchGeniousByName(nameSearch : string) {

    // Volvemos a pasar el nombre a minúscula, por si es llamado desde otro componente
    const lowerSearch = nameSearch.toLowerCase();
  
    if (!lowerSearch) {
      // Si no hay texto, mostramos todos los genios
      this.filteredGeniousData = [...this.geniousData];
    } else {
      this.filteredGeniousData = this.geniousData.filter(genio =>
        genio.name.toLowerCase().startsWith(lowerSearch)
      );
    }
      
  } 

  searchGeniousByCategory(category :string) {
    // 1º Recibimos el texto del segmento selecionado
    // 2º Hacemos uso de un enum para identificar el valor númerico de la categoría
    // 3º Filtramos el array con todos lo genios en base a la categoría
    let categoryEnum : number ;

    if(category === "MATEMATICOS"){
      categoryEnum = GeniousCategory.Math; 
    }else if (category === "FISICOS"){
      categoryEnum = GeniousCategory.Physic; 
    }else if (category === "INFORMATICAS"){
      categoryEnum = GeniousCategory.Informatic; 
    }else{
      categoryEnum = GeniousCategory.Todos;
    }

    if (categoryEnum === GeniousCategory.Todos) {
      // Si no hay texto, mostramos todos los genios
      this.filteredGeniousData = [...this.geniousData];
    } else {
      this.filteredGeniousData = this.geniousData.filter(genio =>
        genio.category === categoryEnum
      );
    }

  }

  // Métodos para acceder a los datos
  getGeniousData() {
    return this.geniousData;
  }

  getGeniousDataByName(){
    return this.filteredGeniousData;
  }


  
}