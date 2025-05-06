import { Component, Output, EventEmitter } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-button-filter',
  templateUrl: './button-filter.component.html',
  styleUrls: ['./button-filter.component.scss'],
  imports: [IonLabel, IonSegment, IonSegmentButton, FormsModule ],
})
export class ButtonFilterComponent   {

  constructor() {}

  // Desde aquí solo pasamos el texto de la categoría selecionada
  // Luego en el componente gallery hacemos el filtrado por la categoría selecionada

  textoCategory: string = '';

  @Output() textoBuscado = new EventEmitter<string>();

  onSearchChange(event: any) {
    // 1º Obtenemos el texto introducido en la barra de búsqueda de manera reactiva
    // 2º Pasamos dicho texto a minúscula
    // 3º Se lo pasamos al componente home 
    const valor = event.target.value.toLowerCase();
    this.textoBuscado.emit(valor); // Emitimos el texto al padre


  }
}
