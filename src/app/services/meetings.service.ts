import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CoursesService, FirebaseCourseRecord } from './courses.service';

interface MeetingInfo {
  courseName: string;
  meetingId: any;     // a reference to a meeting document, I think.
  date: string;       // timeGenerated in firebase.
  qrEncodedString: string;
  notes: string;
  numberOfAttendees: number;
}

interface FirebaseMeetingSubmissionRecord {
  firstName: string;
  lastName: string;
  userId: string;
  notes: string;
}

interface FirebaseMeetingRecord {
  notes: string;
  qrCode: string;
  timeGenerated: Date;
  submissions: FirebaseMeetingSubmissionRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  private meetings: MeetingInfo[] = [];
  private meetingCollection: AngularFirestoreCollection<FirebaseMeetingRecord>;

  public meetingsSubj: BehaviorSubject<MeetingInfo[]> = new BehaviorSubject<MeetingInfo[]>(undefined);

  constructor(
    private db: AngularFirestore,
    private cSvc: CoursesService,
  ) { }

  public loadMeetings(selectedCourses: string[]) {
    this.meetings = [];

    console.log('loadMeetings: ', selectedCourses);

    this.cSvc.coursesSubj.subscribe(data => {
      if (!data) {
        return;
      }
      // only add courses with meetings.
      const coursesWithMeetings = data.filter((course) => selectedCourses.includes(course.name) && course.meetingsDoc);

      // Seems to me that meetingsDoc is a Doc Reference, but I cannot use it as such...
      // So, I'll make a new one from the id.

      this.meetings = [];
      for (let courseInfo of coursesWithMeetings) {
        this.db.doc('/meetings/' + courseInfo.meetingsDoc.id).get().subscribe(res => {
          const zeroth = res.get('0');
          console.log('res = ', zeroth.length);
          for (let i = 0; i < zeroth.length; i++) {
            const mtg = zeroth[i];
            this.meetings.push({
              meetingId: courseInfo.meetingsDoc,
              courseName: courseInfo.name,
              date: mtg.timeGenerated.toString(),
              notes: mtg.notes,
              numberOfAttendees: 7,
              qrEncodedString: mtg.qrEncodedString
            });
          }
        });
      }
      // Tell all subscribers that the data has arrived.
      this.meetingsSubj.next(this.meetings);
    });
  }

  //     // this.meetings = courseIds.map(courseId => {
  //     //   let meetingCollection = this.db.collection<FirebaseCourseRecord>('courses/').doc<FirebaseMeetingRecord>(courseId);
  //     //   meetingCollection.get().subscribe(doc => {

  //     //   })

  //     });



  //   });
  // }

}

