import { Component, Output, EventEmitter } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [IonSearchbar,FormsModule],
})
export class NavComponent {
  
  textoBusqueda: string = '';

  @Output() textoBuscado = new EventEmitter<string>();

  onSearchChange(event: any) {
    // 1º Obtenemos el texto introducido en la barra de búsqueda de manera reactiva
    // 2º Pasamos dicho texto a minúscula
    // 3º Se lo pasamos al componente home 
    const valor = event.target.value.toLowerCase();
    this.textoBuscado.emit(valor); // Emitimos el texto al padre


  }
  


  

}
