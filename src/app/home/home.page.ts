import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { AfterViewInit } from '@angular/core';
import { GalleryComponent } from 'src/components/gallery/gallery.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GalleryComponent],

})
export class HomePage implements AfterViewInit {
  
  constructor(private apiService: ApiService) { } // Inyectamos el ApiService


  ngAfterViewInit() {
    // Aquí puedes acceder al DOM después de que el componente se haya renderizado completamente.
    const element = document.getElementById('container');
    if (element) {
      console.log('Element height:', element.offsetHeight);
    }
  }
}
