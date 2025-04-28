import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent  implements OnInit {

  constructor(private apiService : ApiService) { }

  ngOnInit() {}

  // Necesito optener las fotos de todos los genios y por cada 
  // imagen generar su propio mini contenedor

}
