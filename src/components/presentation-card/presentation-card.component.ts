import { Component, Input , Output, EventEmitter} from '@angular/core';
import { IonButton, IonImg ,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; 
import { DatosGenio } from 'src/app/models/datos-genio';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
  imports: [IonButton, IonImg ,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonicModule],
})
export class PresentationCardComponent {

  @Input() genius!: DatosGenio;
  @Input() name!: string;
  @Input() photoUrl!: string;

  @Output() close = new EventEmitter<void>();

  closeCard() {
    this.close.emit();
  }
}
