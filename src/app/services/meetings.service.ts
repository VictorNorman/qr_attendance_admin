import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { CoursesService } from "./courses.service";
import { firestore } from "firebase/app";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import { SubmissionService } from "./submission.service";

export interface MeetingInfo {
  courseName: string;
  date: string; // field is timeGenerated in firebase.
  qrEncodedString: string;
  notes: string;
  numberOfAttendees: number;
  submissionsId: any;    // see comment below about submissionsIds
}

interface FirebaseMeetingSubmissionRecord {
  firstName: string;
  lastName: string;
  userId: string;
  notes: string;
}

interface FirebaseMeetingRecord {
  notes: string;
  qrCodeStr: string;
  timeGenerated: Date;
  submissionsId: any;     // these things are weird: they look like strings but are objects.
}

@Injectable({
  providedIn: "root",
})
export class MeetingsService {
  private meetings: MeetingInfo[] = [];
  public meetingsSubj: BehaviorSubject<MeetingInfo[]> = new BehaviorSubject<MeetingInfo[]>(undefined);

  constructor(
    private db: AngularFirestore,
    private cSvc: CoursesService,
    private sSvc: SubmissionService
  ) {

    this.db.collection("/meetings").snapshotChanges().subscribe(docChActions => {
      this.meetings = [];
      docChActions.forEach(dca => {
        console.log('id ', dca.payload.doc.id, ' data ', dca.payload.doc.data());
        const mtgs: FirebaseMeetingRecord[] = dca.payload.doc.data()["mtgs"];
        mtgs.forEach(async (mtg) => {
          // console.log("LOOKING AT mtg", mtg);
          const courseName = dca.payload.doc.id as string;
          this.meetings.push({
            courseName,
            date: this.convertTimestampToDate(mtg.timeGenerated).toLocaleString(),
            qrEncodedString: mtg.qrCodeStr,
            notes: mtg.notes,
            numberOfAttendees: await this.sSvc.getNumSubmissionsForMeeting(mtg.submissionsId),
            submissionsId: mtg.submissionsId,
          });
        });
      });
      console.log("mSvc: All meetings = ", this.meetings);
      // Tell all subscribers that the data has arrived.
      this.meetingsSubj.next(this.meetings);
    });
  }

  public getMeetingsForCourses(courseNames: string[]): MeetingInfo[] {
    return this.meetings.filter(m => courseNames.includes(m.courseName));
  }

  // from https://stackoverflow.com/questions/34718668/firebase-timestamp-to-date-and-time.
  // Probably is over-complicated.
  private convertTimestampToDate(timestamp: Timestamp | any): Date | any {
    return timestamp instanceof Timestamp
      ? new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
      : timestamp;
  }

  // You can add a new meeting for multiple courses at once -- like CS195 and CS295.
  public addNewMeeting(selectedCourseNames: string[], notes: string, qrCodeStr: string) {
    this.cSvc.coursesSubj.subscribe(async (data) => {
      // console.log("addNewMeeting: top, data = ", data);
      if (!data) {
        console.log("data is EMPTY!");
        return;
      }
      const selectedCoursesInDb = data.filter((course) => {
        return selectedCourseNames.includes(course.name);
      });
      // console.log("addNewMeeting: selCouIDB: ", selectedCoursesInDb);

      for (let courseInfo of selectedCoursesInDb) {
        const submissionDocId = await this.sSvc.addNewSubmissionsDoc();
        const docRef = this.db.doc("/meetings/" + courseInfo.name);
        docRef.update({
          mtgs: firestore.FieldValue.arrayUnion({
            notes,
            qrCodeStr,
            timeGenerated: new Date(),
            submissionsId: submissionDocId,
          }),
        });
      }
    });
  }

  public async deleteMeeting(meeting: MeetingInfo) {

    await this.sSvc.deleteSubmissions(meeting.submissionsId);

    this.db.doc('/meetings/' + meeting.courseName).get().subscribe(o => {
      const mtgs: FirebaseMeetingRecord[] = o.data().mtgs;
      for (let i = 0; i < mtgs.length; i++) {
        if (mtgs[i].submissionsId.id === meeting.submissionsId.id) {
          const obj2del = mtgs[i];
          // console.log('obj2del = ', obj2del);
          this.db.doc("/meetings/" + meeting.courseName).update({
            mtgs: firestore.FieldValue.arrayRemove(obj2del),
          });
          return;
        }
      }
    });
  }

}
