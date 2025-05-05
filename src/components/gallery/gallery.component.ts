import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { catchError, forkJoin, map } from 'rxjs';
import { of } from 'rxjs';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MiniCardGeniousComponent } from '../mini-card-genious/mini-card-genious.component';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports : [NgFor, CommonModule , IonHeader, IonToolbar, IonTitle,  IonGrid, IonRow, IonCol , MiniCardGeniousComponent]
})
export class GalleryComponent  implements OnInit {

  // Usamos un solo array de objetos para contener tanto el nombre como la foto
  private geniousData: { name: string, photoUrl: string | null }[] = [];
  private filteredGeniousData: { name: string, photoUrl: string | null }[] = [];

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
          ...math.map(name => name.replace("Categoría:", "")),
          ...physic.map(name => name.replace("Categoría:", "")),
          ...informatic
        ];

        console.log('Todos los nombres:', allNames); // 👈 Verificar los nombres


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

  getPhotos(allNames: string[]) {
    // Si no hay nombres, salimos de la función
    if (allNames.length === 0) {
      console.log('No hay nombres para cargar fotos');
      return;
    }

    // Creamos los observables para obtener las fotos de los genios
    const arrayObservable = allNames.map((name) =>
      this.apiService.getImage(name).pipe(
        catchError((err) => {
          console.log('Error al obtener la foto del genio:', name, err);
          return of(null); // Si hay error, devolvemos null
        })
      )
    );

    // Esperamos que todas las solicitudes se resuelvan usando forkJoin
    forkJoin(arrayObservable).subscribe({
      next: (photos) => {
        console.log('Fotos obtenidas:', photos); // 👈 Verificar las fotos obtenidas

        // Combinamos los nombres con las fotos
        this.geniousData = allNames.map((name, index) => ({
          name,
          photoUrl: photos[index] || null // Si no hay foto, asignamos null
        }));
        console.log('Genios con fotos:', this.geniousData); // 👈 Agrega esto

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

  // Métodos para acceder a los datos
  getGeniousData() {
    return this.geniousData;
  }

  getGeniousDataByName(){
    return this.filteredGeniousData;
  }


  
}