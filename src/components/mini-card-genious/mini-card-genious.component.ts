import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Importamos IonicModule

@Component({
  selector: 'app-mini-card-genious',
  templateUrl: './mini-card-genious.component.html',
  styleUrls: ['./mini-card-genious.component.scss'],
  standalone: true,  // Definimos el componente como standalone
  imports: [IonicModule],  // Importamos IonicModule para poder usar IonCard y demás componentes de Ionic
})
export class MiniCardGeniousComponent {

  @Input() photoUrl: string | null = '';
  @Input() name: string = '';

  constructor() {}

}
