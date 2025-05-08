import { Component, Output, EventEmitter } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-segment-button',
  templateUrl: './segment-button.component.html',
  styleUrls: ['./segment-button.component.scss'],
  standalone: true,
  imports: [IonLabel, IonSegment, IonSegmentButton, FormsModule],
})
export class SegmentButtonComponent {

  textoCategory: string = '';

  @Output() categorySelected = new EventEmitter<string>();

  onSearchChange(event: any) {
    const valor = event.detail.value.normalize("NFD").toUpperCase(); // Normalizamos y pasamos a MAYÚSCULAS
    this.categorySelected.emit(valor);
  }

}
