import { Component, Input , Output, EventEmitter} from '@angular/core';
import { IonButton, IonImg ,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
  imports: [IonButton, IonImg ,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonicModule],
})
export class PresentationCardComponent {

  constructor() { }

  @Input() name!: string;
  @Input() photoUrl!: string;
  @Input() category!: string;
  @Input() achievements!: string;
  @Input() studies!: string;

  @Output() close = new EventEmitter<void>();

  closeCard() {
    this.close.emit();
  }
}
