import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CoursesService, FirebaseCourseRecord } from './courses.service';
import { firestore } from 'firebase/app';

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
          const mtgsList = res.get('mtgs');
          console.log('res = ', mtgsList.length);
          for (let i = 0; i < mtgsList.length; i++) {  // foreach does not work for some reason.
            const mtg = mtgsList[i];
            this.meetings.push({
              meetingId: courseInfo.meetingsDoc,
              courseName: courseInfo.name,
              date: mtg.timeGenerated.toString(),
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

  // You can add a new meeting for multiple courses at once -- like CS195 and CS295.
  public addNewMeeting(selectedCourses: string[], notes: string, qrCodeStr: string) {
    console.log('selectedCourses = ', selectedCourses);
    this.cSvc.coursesSubj.subscribe(data => {
      console.log('addNewMeeting: top, data = ', data);
      if (!data) {
        console.log('data is EMPTY!');
        return;
      }
      const selectedCoursesInDb = data.filter((course) => {
        console.log('course = ', course.name);
        console.log('found in selectedCourses: ', selectedCourses.includes(course.name));
        return selectedCourses.includes(course.name);
      });
      console.log('addNewMeeting: selCouIDB: ', selectedCoursesInDb);

      for (let courseInfo of selectedCoursesInDb) {
        const docRef = this.db.doc('/meetings/' + courseInfo.meetingsDoc.id);
        console.log('addNewMeeting: calling update on docRef: ', docRef);
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

