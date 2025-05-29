import { Component, Input, OnDestroy } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Genius } from 'src/app/models/Genius';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
  imports: [IonicModule],
})
export class PresentationCardComponent implements OnDestroy {

  @Input() genius!: Genius;

  isScrolling = false;
  scrollY = 0;
  private scrollTimeout?: any;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Se dispara en cada evento de scroll de ion-content.
   * @param event CustomEvent que contiene detail.scrollTop.
   */
  onScroll(event: CustomEvent<{ scrollTop: number }>) {
    this.isScrolling = true;
    this.scrollY = event.detail.scrollTop;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 200);
  }

  /**
   * Cierra el modal.
   */
  closeCard() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    // Limpieza de cualquier timeout pendiente
    clearTimeout(this.scrollTimeout);
  }
}
