import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewMeetingPage } from './new-meeting.page';

describe('NewMeetingPage', () => {
  let component: NewMeetingPage;
  let fixture: ComponentFixture<NewMeetingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMeetingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMeetingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
