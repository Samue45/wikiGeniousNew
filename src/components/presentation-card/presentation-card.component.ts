import { Component, Input,  ViewChild, AfterViewInit, ElementRef,OnDestroy } from '@angular/core';
import { IonicModule, ModalController  } from '@ionic/angular';
import { Genius } from 'src/app/models/Genius';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
  imports: [IonicModule],
})
export class PresentationCardComponent implements AfterViewInit, OnDestroy {

  @Input() genius!: Genius;  

  @ViewChild('scrollArea', { static: false})
  scrollArea!: ElementRef<HTMLElement>;

  isScrolling = false;
  scrollY = 0;
  private scrollTimeout?: any;

  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit(){
    const scroll = this.scrollArea.nativeElement;
    scroll.addEventListener('scroll',this.onScroll);
  }

  ngOnDestroy() {
    const scroll = this.scrollArea?.nativeElement;
    if(scroll) {
      scroll.removeEventListener('scroll', this.onScroll);
    }
    clearTimeout(this.scrollTimeout);
  }

  private onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const newY = target.scrollTop;

    if (!this.isScrolling) {
      this.isScrolling = true;
      this.handleScrollStart();
    }

    this.scrollY = newY;
    this.handleScroll({ scrollTop: newY });

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.handleScrollEnd();
    }, 100);
  };

  private handleScrollStart() {
    console.log('Scroll iniciado');
  }

  private handleScroll(detail: { scrollTop: number }) {
    console.log(`Scroll en ${detail.scrollTop}px`);
  }

  private handleScrollEnd() {
    console.log('Scroll terminado');
  }

  closeCard() {
    this.modalCtrl.dismiss();
  }

}
