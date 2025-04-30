import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eye, eyeOff  } from 'ionicons/icons';

@Component({
  selector: 'app-button-filter',
  templateUrl: './button-filter.component.html',
  styleUrls: ['./button-filter.component.scss'],
  imports: [IonButton, IonIcon],
})
export class ButtonFilterComponent  implements OnInit {
  icon = eye; // Por defecto, el ícono es el ojo cerrado.


  constructor() {
    addIcons({ eye, eyeOff }); // Registramos ambos íconos
  }

  ngOnInit() {}

  toggleEye(){
    this.icon = this.icon === eye ? eyeOff : eye;
  }
}
