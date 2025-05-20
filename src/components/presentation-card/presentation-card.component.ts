import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Genius } from 'src/app/models/Genius';


@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
  imports: [IonicModule],
})
export class PresentationCardComponent {

  @Input() genius!: Genius;  

  constructor(private modalCtrl: ModalController) {}

  closeCard() {
    this.modalCtrl.dismiss();
  }

}
