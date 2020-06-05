import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase/app";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

interface FirebaseMeetingSubmissionRecord {
  firstName: string;
  lastName: string;
  userId: string;
  notes: string;
}

interface FirebaseMeetingRecord {
  qrCodeStr: string;
  timeGenerated: Date;
  submissionsId: string;
}

@Injectable({
  providedIn: "root",
})
export class SubmissionService {
  constructor(
    private db: AngularFirestore,
  ) { }

  getNumSubmissionsForMeeting(submissionsId: string) {
    return new Promise<number>((resolve) => {
      this.db.doc(submissionsId).get().subscribe((data) => {
        const submissions = data.data()["submissions"] as FirebaseMeetingSubmissionRecord[];
        return resolve(submissions.length);
      });
    });
  }
}
