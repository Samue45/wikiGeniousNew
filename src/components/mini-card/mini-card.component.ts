import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Genius } from 'src/app/models/Genius';

@Component({
  selector: 'app-mini-card',
  templateUrl: './mini-card.component.html',
  styleUrls: ['./mini-card.component.scss'],
  standalone: true, 
  imports: [IonicModule],
})
export class MiniCardComponent  {

  @Input() genius!: Genius;                       // recibimos el objeto completo
  @Output() selected = new EventEmitter<Genius>(); // emitimos el objeto completo

  onClick() {
    this.selected.emit(this.genius);
  }

}
