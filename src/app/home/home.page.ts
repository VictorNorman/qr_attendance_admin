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
    private alertCtrl: AlertController,
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
      // console.log('home: meetings changed: selectedCourses are', this.selectedCourseNames());
      // Ugh!  I hate this stuff.  If you don't delay the getting of meeitngs for selected
      // courses, then there is a race condition between the code that adds the new meeting
      // and this code.  The result is this.meetings in meetings.service.ts is an empty list
      // when getMeetingsForCourses() is run, so you get back an empty result. This 1 second
      // delay fixes it.  But, ugh.
      setTimeout(() => {
        this.meetings = this.mSvc.getMeetingsForCourses(this.selectedCourseNames());
      }, 1000);
      // console.log('this.meetings now', this.meetings);
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
      this.cSvc.addNewCourse(data.courseName, data.adminEmail, data.password, data.description);
    }
  }

  public addNewMeeting() {
    this.router.navigate(['/new-meeting']);
  }

  public noCoursesSelected() {
    return (this.selectedCourseNames().length === 0);
  }

  private async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
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
          this.presentToast('Updated attendance file downloaded to ' + filename);
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

  public async deleteMeeting(meeting: MeetingInfo) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Do you really want to delete the meeting and all attendance submissions?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.mSvc.deleteMeeting(meeting);
          }
        }
      ]
    });
    await alert.present();
  }

  computeClasses(rowIndex: number, numRows: number) {
    return {
      'odd-row': (rowIndex % 2 === 0),
      'last-row': (rowIndex === numRows - 1),
    };
  }
}
