import { Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { NewCourseModalPage } from '../pages/new-course-modal/new-course-modal.page';
import { MeetingsService, MeetingInfo } from '../services/meetings.service';
import { Router } from '@angular/router';
import { SelectedCoursesService } from '../services/selected-courses.service';
import { Papa } from 'ngx-papaparse';
import { SubmissionService } from '../services/submission.service';

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
    private sSvc: SubmissionService,
    private router: Router,
    private selCoursesSvc: SelectedCoursesService,
    private papa: Papa,
    private toastCtrl: ToastController,
  ) {
    // Get the list of courses from the service, once it has gotten them
    // from the database.
    this.cSvc.coursesSubj.subscribe(data => {
      if (!data) {
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

  private async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 10000,
    });
    toast.present();
  }

  public uploadCSV(event, meeting: MeetingInfo) {
    console.log('event = ', event);

    // https://cmatskas.com/importing-csv-files-using-jquery-and-html5/
    const orig_file = event.target.files[0];
    console.log('file = ', orig_file.name);
    const reader = new FileReader();
    console.log('reader = ', reader);
    reader.readAsText(orig_file);
    reader.onload = (ev) => {
      const csvData = ev.target.result as string;
      this.papa.parse(csvData, {
        complete: async (result) => {
          // result is an object with data = array of arrays of strings.
          const rows = result.data;
          console.log('Orig rows = ', rows);
          // [ Identifier, Full name, Email address, Status, Grade, Maximum Grade, etc. ]
          // important fields are email address and grade.
          const modifiedCsv = await this.sSvc.addGradesToMoodleCsv(rows, meeting.submissionsId);
          console.log('😃modifiedCSV = ', modifiedCsv);
          // tslint:disable-next-line:max-line-length
          // From https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
          // Don't know how it works, but it works...
          const element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.makeCsv(modifiedCsv)));
          const nameWithoutCsv = orig_file.name.replace(/.csv$/, "");
          const filename = `${nameWithoutCsv}-updated.csv`;
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          this.presentToast('Update attendance file downloaded to ' + filename);
        }
      });
    }
    reader.onerror = () => {
      alert('Unable to read file ' + orig_file.fileName);
    }
  }

  private makeCsv(rows: string[][]): string {
    return this.papa.unparse(rows);
  }
}
