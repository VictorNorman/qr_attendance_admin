import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewCourseModalPage } from './new-course-modal.page';

describe('NewCourseModalPage', () => {
  let component: NewCourseModalPage;
  let fixture: ComponentFixture<NewCourseModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCourseModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCourseModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
