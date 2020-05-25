import { Component, OnInit } from '@angular/core';
import { MeetingsService } from 'src/app/services/meetings.service';
import { ActivatedRoute } from '@angular/router';
import { SelectedCoursesService } from 'src/app/services/selected-courses.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.page.html',
  styleUrls: ['./new-meeting.page.scss'],
})
export class NewMeetingPage implements OnInit {

  public qrGenerated = false;
  public qrEncodedString = '';
  public notes = '';
  public duration = 3;    // minutes, by default

  constructor(
    private mCtrl: MeetingsService,
    private selCoursesSvc: SelectedCoursesService,
  ) { }

  ngOnInit() {
  }

  generateQRCodeAndMeeting() {
    if (! this.qrEncodedString) {
      return;
    }
    const selCourses = this.selCoursesSvc.getNames();
    this.qrGenerated = true;
    this.mCtrl.addNewMeeting(selCourses, this.notes, this.qrEncodedString);
  }
}
