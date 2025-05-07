import { Component ,ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AfterViewInit } from '@angular/core';
import { GalleryComponent } from 'src/components/gallery/gallery.component';
import { NavComponent } from 'src/components/nav/nav.component';
import { ButtonFilterComponent } from 'src/components/button-filter/button-filter.component';
import { DatosGenio } from '../models/datos-genio';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GalleryComponent, NavComponent, ButtonFilterComponent],

})
export class HomePage implements AfterViewInit {

  @ViewChild('gallery') gallery!: GalleryComponent;
  selectedGenius: DatosGenio | null = null;
  
  searchText: string = '';
  categoryText: string = '';

  
  constructor() { }


  ngAfterViewInit() {
    // Aquí puedes acceder al DOM después de que el componente se haya renderizado completamente.
    this.updateFilter();
  }

  onTextSearch(text: string) {
    this.searchText = text;
    this.updateFilter();
  }

  onCategorySearch(category: string) {
    this.categoryText = category;
    this.updateFilter();
  }

  updateFilter() {
    // Comprobación para evitar errores si aún no se ha inicializado
    if (this.gallery) {
      this.gallery.searchGeniousByNameAndCategory(this.searchText, this.categoryText);
    }
  }

  
  // Método que se ejecuta cuando seleccionas un genio en la galería
  onGeniusSelected(genius: DatosGenio) {
    this.selectedGenius = genius;
  }

}
