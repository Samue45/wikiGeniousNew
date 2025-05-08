import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mini-card',
  templateUrl: './mini-card.component.html',
  styleUrls: ['./mini-card.component.scss'],
  standalone: true, 
  imports: [IonicModule],
})
export class MiniCardComponent  {

  @Input() photoUrl: string | null = '';
  @Input() name: string = '';

  constructor() {}

}
