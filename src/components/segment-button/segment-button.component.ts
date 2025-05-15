import { Component, Output, EventEmitter , OnInit} from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-segment-button',
  templateUrl: './segment-button.component.html',
  styleUrls: ['./segment-button.component.scss'],
  standalone: true,
  imports: [IonLabel, IonSegment, IonSegmentButton, FormsModule],
})
export class SegmentButtonComponent implements OnInit {

  textoCategory: string = 'todos';

  @Output() categorySelected = new EventEmitter<string>();

  ngOnInit() {
    this.categorySelected.emit(this.textoCategory);
  }

  onSearchChange(event: any) {
    const valor = event.detail.value;
    
    this.categorySelected.emit(valor);
  }

}
