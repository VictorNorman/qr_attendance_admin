import { Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ModalController } from '@ionic/angular';
import { NewCourseModalPage } from '../page/new-course-modal/new-course-modal.page';
import { MeetingsService } from '../services/meetings.service';
import { Subscription } from 'rxjs';

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
  public meetings = [];

  private subscription: Subscription = null;

  constructor(
    private cSvc: CoursesService,
    private mSvc: MeetingsService,
    private mCtrl: ModalController,
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
    this.mSvc.loadMeetings(selectedCourseNames);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.mSvc.meetingsSubj.subscribe(m => {
      console.log('selectionChanged: m = ', m);
      this.meetings = m;
    });
  }

  public async openNewCourseModal() {
    const newCourseModal = await this.mCtrl.create({
      component: NewCourseModalPage,
    });
    await newCourseModal.present();
    const { data } = await newCourseModal.onDidDismiss();
    console.log('newCourseData = ', data);
    // call service to add new course data to db
    this.cSvc.addNewCourse(data.courseName, data.adminEmail, data.password, data.notes);
  }
}
