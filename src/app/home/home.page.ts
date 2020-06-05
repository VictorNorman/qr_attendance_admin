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

  public uploadCSV(event, meeting: MeetingInfo) {
    console.log('event = ', event);

    // https://cmatskas.com/importing-csv-files-using-jquery-and-html5/
    const file = event.target.files[0];
    console.log('file = ', file);
    const reader = new FileReader();
    console.log('reader = ', reader);
    reader.readAsText(file);
    reader.onload = (ev) => {
      const csvData = ev.target.result;
      console.log('csvData = ', csvData);
    }
    reader.onerror = () => {
      alert('Unable to read file ' + file.fileName);
    }

    // const csvContents = this.makeCsv();

    // // tslint:disable-next-line:max-line-length
    // // From https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
    // // Don't know how it works, but it works...
    // const element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContents));
    // element.setAttribute('download', `attendance-${meeting.date}.csv`);

    // element.style.display = 'none';
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
  }

  // private makeCsv(): string {
  //   // tslint:disable-next-line:max-line-length
  //   const header = `"Trail Id", "Completion Date", "Rating", "Step 1 %", "Step 2 %", "Step 3 %", "Step 4 %", "Step 5 %", "Total %"\n`;
  //   const result = header + this.records.map((rec, idx) => {
  //     // tslint:disable-next-line:max-line-length
  //     let line = `${rec.trailId}, ${rec.dateCompleted}, ${rec.rating}, ${(rec.step1TimesRead)}, ${(rec.step2TimesRead)}, ${(rec.step3TimesRead)}, ${(rec.step4TimesRead)}, ${(rec.step5TimesRead)}, ${(rec.totalTimesRead).toFixed(3)},`;

  //     // Add a blank line between each group of results: e.g., between the last 102 and first 103 lines.
  //     if (idx > 1 && rec.trailId !== this.records[idx - 1].trailId) {
  //       line = '\n' + line;
  //     }
  //     return line;
  //   }).join('\n');
  //   return result;
  // }
}
