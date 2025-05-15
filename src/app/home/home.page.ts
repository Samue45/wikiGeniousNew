import { Component ,ViewChild} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AfterViewInit } from '@angular/core';
import { GalleryComponent } from 'src/components/gallery/gallery.component';
import { NavComponent } from 'src/components/nav/nav.component';
import { SegmentButtonComponent } from 'src/components/segment-button/segment-button.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GalleryComponent, NavComponent, SegmentButtonComponent],

})
export class HomePage implements AfterViewInit {

  @ViewChild('gallery') gallery!: GalleryComponent;
  
  searchText: string = '';
  categoryText: string = 'todos';

  
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
      try {
        this.gallery.searchGeniousByNameAndCategory(this.searchText, this.categoryText);
        console.log(`Filtrando: Nombre -> ${this.searchText}, Categoría -> ${this.categoryText}`);
      } catch (error) {
        console.error('Error al actualizar el filtro:', error);
      }    }
  }


}
