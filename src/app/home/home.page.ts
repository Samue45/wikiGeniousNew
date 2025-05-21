import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { GalleryComponent } from 'src/components/gallery/gallery.component';
import { NavComponent } from 'src/components/nav/nav.component';
import { SegmentButtonComponent } from 'src/components/segment-button/segment-button.component';
import { PresentationCardComponent } from 'src/components/presentation-card/presentation-card.component';
import { Genius } from '../models/Genius';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,           // para *ngIf, *ngFor…
    IonicModule,          
    GalleryComponent,
    NavComponent,
    SegmentButtonComponent,
    PresentationCardComponent
  ]
})
export class HomePage implements AfterViewInit {

  @ViewChild('gallery') gallery!: GalleryComponent;
  
  searchText: string = '';
  categoryText: string = 'todos';
  selectedGenius: Genius | null = null;
  
  constructor(private modalCtrl: ModalController) {}


  ngAfterViewInit() {
    // Aquí puedes acceder al DOM después de que el componente se haya renderizado completamente.
    this.updateFilter();
  }

  async onGeniusSelected(genius: Genius) {
    const modal = await this.modalCtrl.create({
      component: PresentationCardComponent,
      componentProps: { genius },
      cssClass: 'presentation-modal'
    });
    await modal.present();
    // hasta que el usuario cierre el modal, no vuelve aquí
    await modal.onDidDismiss();
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
