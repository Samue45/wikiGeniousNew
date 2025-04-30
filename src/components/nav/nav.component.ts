import { Component, OnInit } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [IonSearchbar],
})
export class NavComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
