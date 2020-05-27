import { Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ModalController } from '@ionic/angular';
import { NewCourseModalPage } from '../pages/new-course-modal/new-course-modal.page';
import { MeetingsService, MeetingInfo } from '../services/meetings.service';
import { Subscription } from 'rxjs';
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

  private subscription: Subscription = null;

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
  }

  public selectedCourses(): CourseInfo[] {
    return this.courses.filter(c => c.isChecked);
  }

  // run each time the user clicks or unclicks a course.
  public selectionChanged() {
    const selectedCourseNames = this.selectedCourses().map(c => c.name);
    this.selCoursesSvc.setNames(selectedCourseNames);

    this.meetings = this.mSvc.getMeetingsForCourses(selectedCourseNames);
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
    return (this.selectedCourses().length === 0);
  }
}
