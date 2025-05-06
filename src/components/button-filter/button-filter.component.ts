import { Component, Output, EventEmitter } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-button-filter',
  templateUrl: './button-filter.component.html',
  styleUrls: ['./button-filter.component.scss'],
  standalone: true,
  imports: [IonLabel, IonSegment, IonSegmentButton, FormsModule],
})
export class ButtonFilterComponent {
  textoCategory: string = '';

  @Output() categorySelected = new EventEmitter<string>();

  onSearchChange(event: any) {
    const valor = event.detail.value.normalize("NFD").toUpperCase(); // Normalizamos y pasamos a MAYÚSCULAS
    this.categorySelected.emit(valor);
  }
}
