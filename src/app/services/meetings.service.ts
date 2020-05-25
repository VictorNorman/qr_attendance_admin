import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CoursesService, FirebaseCourseRecord } from './courses.service';
import { firestore } from 'firebase/app';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface MeetingInfo {
  courseName: string;
  meetingId: any;     // a reference to a meeting document, I think.
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
      // only include selected courses in the data.
      const coursesWithMeetings = data.filter((course) => selectedCourses.includes(course.name));

      // Seems to me that meetingsDoc is a Doc Reference, but I cannot use it as such...
      // So, I'll make a new one from the id.
      this.meetings = [];
      for (let courseInfo of coursesWithMeetings) {
        // for some reason, when there are no meetings yet in the document, courseInfo.meetingsDoc is 
        // a string, but otherwise it is an object with the id in it.
        const meetingDocId = (courseInfo.meetingsDoc.id || courseInfo.meetingsDoc);
        this.db.doc('/meetings/' + meetingDocId).get().subscribe(res => {
          const mtgsList = res.get('mtgs');
          for (let i = 0; i < mtgsList.length; i++) {  // foreach does not work for some reason.
            const mtg = mtgsList[i];
            const ts = mtg.timeGenerated;
            this.meetings.push({
              meetingId: courseInfo.meetingsDoc,
              courseName: courseInfo.name,
              date: this.convertTimestampToDate(ts).toLocaleString(),
              notes: mtg.notes,
              numberOfAttendees: 7,
              qrEncodedString: mtg.qrCodeStr,
            });
          }
        });
      }
      // Tell all subscribers that the data has arrived.
      this.meetingsSubj.next(this.meetings);
    });
  }


  // from https://stackoverflow.com/questions/34718668/firebase-timestamp-to-date-and-time.
  // Probably is over-complicated.
  convertTimestampToDate(timestamp: Timestamp | any): Date | any {
    return timestamp instanceof Timestamp
      ? new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
      : timestamp;
  }

  // You can add a new meeting for multiple courses at once -- like CS195 and CS295.
  public addNewMeeting(selectedCourses: string[], notes: string, qrCodeStr: string) {
    this.cSvc.coursesSubj.subscribe(data => {
      console.log('addNewMeeting: top, data = ', data);
      if (!data) {
        console.log('data is EMPTY!');
        return;
      }
      const selectedCoursesInDb = data.filter((course) => {
        return selectedCourses.includes(course.name);
      });
      console.log('addNewMeeting: selCouIDB: ', selectedCoursesInDb);

      for (let courseInfo of selectedCoursesInDb) {
        // for some reason, when there are no meetings yet in the document, courseInfo.meetingsDoc is 
        // a string, but otherwise it is an object with the id in it.
        const meetingDocId = (courseInfo.meetingsDoc.id || courseInfo.meetingsDoc);
        const docRef = this.db.doc('/meetings/' + meetingDocId);
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

