import { GeniusService } from 'src/app/services/genius.service';
import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MiniCardComponent } from '../mini-card/mini-card.component';
import { GeniusesCategory } from 'src/app/models/Geniuses-category';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports : [NgFor, CommonModule , IonHeader, IonToolbar, IonTitle,  IonGrid, IonRow, IonCol , MiniCardComponent]
})
export class GalleryComponent  implements OnInit {

  
  constructor(private geniusService : GeniusService) {}

  private Geniuses: GeniusesCategory = {
    [Category.Math] : [],
    [Category.Physic] : [],
    [Category.Informatic] : []
  } 
  // Lista con los genios filtrados
  public filteredGeniuses : any [] = [];

  // Variable con el valor de la categoría
  public selectedCategory : string = 'todos';

  ngOnInit() {
    // Con este método obtenemos todas las URL asociadas a cada foto de cada genio y sus nombres
    this.loadAllGeniuses();

  }

  loadAllGeniuses() : void {
    this.geniusService.getFilteredGeniuses().subscribe({
      next: (data) => {
        this.Geniuses = data;
        this.searchGeniousByNameAndCategory();
        console.log('Datos de los genios cargados con éxito');
      },
      error: (err) => {
        console.log('Hubo un error a cargar los genios del servicio de genios');
        alert('Hubo un error a cargar los genios del servicio de genios');
      },
      complete: () => {
        console.log('Carga de genios completada.');
      }
    });
  }


  searchGeniousByNameAndCategory(nameSearch: string = '', category: string = 'todos') {
    this.selectedCategory = category; // 🔄 Actualizamos la categoría seleccionada
    this.applyFilter(nameSearch);
  }

  applyFilter(nameSearch : string = ''){
    const lowerSearch = nameSearch.toLowerCase();

    if(this.selectedCategory === 'todos'){
      this.filteredGeniuses = [
        ...this.Geniuses[Category.Math],
        ...this.Geniuses[Category.Physic],
        ...this.Geniuses[Category.Informatic],
      ].filter(genius => genius.name.toLocaleLowerCase().startsWith(lowerSearch));

      console.log(this.Geniuses.math)
    }else {
      this.filteredGeniuses = this.Geniuses[this.selectedCategory as Category].filter(genio =>
        genio.name.toLowerCase().includes(lowerSearch)
      );
    }
  }



}