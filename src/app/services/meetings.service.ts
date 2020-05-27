import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CoursesService } from './courses.service';
import { firestore } from 'firebase/app';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface MeetingInfo {
  courseName: string;
  date: string;       // field is timeGenerated in firebase.
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
  public meetingsSubj: BehaviorSubject<MeetingInfo[]> = new BehaviorSubject<MeetingInfo[]>(undefined);

  constructor(
    private db: AngularFirestore,
    private cSvc: CoursesService,
  ) {
    this.db.collection('/meetings').snapshotChanges().subscribe(docChActions => {
      this.meetings = [];
      docChActions.forEach(dca => {
        console.log('id ', dca.payload.doc.id, ' data ', dca.payload.doc.data());
        const mtgs: FirebaseMeetingRecord[] = dca.payload.doc.data()['mtgs'];
        mtgs.forEach(mtg => {
          this.meetings.push({
            courseName: dca.payload.doc.id as string,
            date: this.convertTimestampToDate(mtg.timeGenerated).toLocaleString(),
            qrEncodedString: mtg.qrCode,
            notes: mtg.notes,
            numberOfAttendees: 7,
          })
        })
      });
      console.log('All meetings = ', this.meetings);
      // Tell all subscribers that the data has arrived.
      this.meetingsSubj.next(this.meetings);
    });
  }

  public getMeetingsForCourses(courseNames: string[]): MeetingInfo[] {
     return this.meetings.filter(m => courseNames.includes(m.courseName));
  }

  // from https://stackoverflow.com/questions/34718668/firebase-timestamp-to-date-and-time.
  // Probably is over-complicated.
  convertTimestampToDate(timestamp: Timestamp | any): Date | any {
    return timestamp instanceof Timestamp
      ? new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
      : timestamp;
  }

  // You can add a new meeting for multiple courses at once -- like CS195 and CS295.
  public addNewMeeting(selectedCourseNames: string[], notes: string, qrCodeStr: string) {
    this.cSvc.coursesSubj.subscribe(data => {
      console.log('addNewMeeting: top, data = ', data);
      if (!data) {
        console.log('data is EMPTY!');
        return;
      }
      const selectedCoursesInDb = data.filter((course) => {
        return selectedCourseNames.includes(course.name);
      });
      console.log('addNewMeeting: selCouIDB: ', selectedCoursesInDb);

      for (let courseInfo of selectedCoursesInDb) {
        // for some reason, when there are no meetings yet in the document, courseInfo.meetingsDoc is 
        // a string, but otherwise it is an object with the id in it.
        const docRef = this.db.doc('/meetings/' + courseInfo.name);
        docRef.update({
          mtgs: firestore.FieldValue.arrayUnion({
            notes,
            qrCodeStr,
            timeGenerated: new Date(),
            submissions: [],
          }),
        });
      }
    });
  }

}
