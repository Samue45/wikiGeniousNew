import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MiniCardGeniousComponent } from './mini-card-genious.component';

describe('MiniCardGeniousComponent', () => {
  let component: MiniCardGeniousComponent;
  let fixture: ComponentFixture<MiniCardGeniousComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniCardGeniousComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniCardGeniousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
