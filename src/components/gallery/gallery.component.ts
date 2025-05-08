import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { catchError, forkJoin, map } from 'rxjs';
import { of } from 'rxjs';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MiniCardComponent } from '../mini-card/mini-card.component';
import { GeniusCategory } from 'src/app/models/GeniusCategory ';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports : [NgFor, CommonModule , IonHeader, IonToolbar, IonTitle,  IonGrid, IonRow, IonCol , MiniCardComponent]
})
export class GalleryComponent  implements OnInit {

  private geniusData: { name: string, category: number, photoUrl: string | null }[] = [];
  private filteredGeniusData: { name: string, category: number, photoUrl: string | null }[] = [];
  
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
          ...informatic.map(genious => ({
            ...genious,
            name: genious.name.replace("Categoría:", "").trim()
          }))
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
      math: this.apiService.getNamesMathGenius(),
      physic: this.apiService.getNamesPhysicGenius(),
      informatic: this.apiService.getNamesInformaticGenius()
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
        this.geniusData = allNames.map((genio, index) => ({
          name: genio.name,
          category: genio.category,
          photoUrl: photos[index] || null
        }));

        this.filteredGeniusData = [...this.geniusData]; // Inicializamos el array para filtrar los genios
      },
      error: (err) => {
        console.log('Hubo un error al obtener las fotos:', err);
      }
    });
  }

  searchGeniousByNameAndCategory(nameSearch: string = '', category: string = 'TODOS'){
    const lowerSearch = nameSearch.toLowerCase();

    // Mapeo de las categorías
    const categoryEnumMap: Record<string, GeniusCategory>  = {
      "MATEMATICOS": GeniusCategory.Math,
      "FISICOS": GeniusCategory.Physic,
      "INFORMATICAS": GeniusCategory.Informatic
    };
  
    const categoryEnum = categoryEnumMap[category.toUpperCase()] ?? GeniusCategory.Todos;
  
    // Aplicar el filtro sobre los genios
    this.filteredGeniusData = this.geniusData.filter(genio => {
      const matchesCategory = categoryEnum === GeniusCategory.Todos || genio.category === categoryEnum;
      const matchesName = !lowerSearch || genio.name.toLowerCase().startsWith(lowerSearch);
  
      return matchesCategory && matchesName;
    });
  
  }
  
  // Métodos para acceder a los datos
  getGeniousData() {
    return this.geniusData;
  }

  getGeniousDataByName(){
    return this.filteredGeniusData;
  }


  
}