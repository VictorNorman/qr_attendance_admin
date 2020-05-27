import { Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ModalController } from '@ionic/angular';
import { NewCourseModalPage } from '../pages/new-course-modal/new-course-modal.page';
import { MeetingsService, MeetingInfo } from '../services/meetings.service';
import { Router } from '@angular/router';
import { SelectedCoursesService } from '../services/selected-courses.service';

interface CourseInfo {
  name: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public courses: CourseInfo[] = [];
  public meetings: MeetingInfo[] = [];

  constructor(
    private cSvc: CoursesService,
    private mSvc: MeetingsService,
    private mCtrl: ModalController,
    private router: Router,
    private selCoursesSvc: SelectedCoursesService,
  ) {
    // Get the list of courses from the service, once it has gotten them
    // from the database.
    this.cSvc.coursesSubj.subscribe(data => {
      if (! data) {
        return;
      }
      this.courses = data.map<CourseInfo>(course => {
        return {
          name: course.name,
          isChecked: false,
        }
      });
    });
    // Get notified when the list of meetings changes, and then go get the 
    // new list for the selected courses.
    this.mSvc.meetingsSubj.subscribe(data => {
      this.meetings = this.mSvc.getMeetingsForCourses(this.selectedCourseNames());
    });
  }

  public selectedCourseNames(): string[] {
    return this.courses.filter(c => c.isChecked).map(c => c.name);
  }

  // run each time the user clicks or unclicks a course.
  public selectionChanged() {
    const slc = this.selectedCourseNames();
    this.selCoursesSvc.setNames(slc);
    this.meetings = this.mSvc.getMeetingsForCourses(slc);
  }

  public async openNewCourseModal() {
    const newCourseModal = await this.mCtrl.create({
      component: NewCourseModalPage,
    });
    await newCourseModal.present();
    const { data } = await newCourseModal.onDidDismiss();
    if (data.courseName !== '') {
      // call service to add new course data to db
      this.cSvc.addNewCourse(data.courseName, data.adminEmail, data.password, data.notes);
    }
  }

  public addNewMeeting() {
    this.router.navigate(['/new-meeting']);
  }

  public addNewMeetingButtonDisabled() { 
    return (this.selectedCourseNames().length === 0);
  }
}
