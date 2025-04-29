import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-card-genious',
  templateUrl: './mini-card-genious.component.html',
  styleUrls: ['./mini-card-genious.component.scss'],
})
export class MiniCardGeniousComponent {
 
  @Input() photoUrl: string = '';
  @Input() name: string = '';

  constructor() {}

}
