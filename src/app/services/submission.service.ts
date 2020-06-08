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

  getNumSubmissionsForMeeting(submissionsId) {
    console.log('getting num subissions for', submissionsId.id);
    return new Promise<number>((resolve) => {
      this.db.doc(submissionsId).get().subscribe(data => {
        const submissions = data.data()["submissions"] as FirebaseMeetingSubmissionRecord[];
        return resolve(submissions.length);
      });
    });
  }

  private getSubmissionsForMeeting(submissionsId: string) {
    return new Promise<FirebaseMeetingSubmissionRecord[]>((resolve) => {
      this.db.doc(submissionsId).get().subscribe((data) => {
        const submissions = data.data()["submissions"] as FirebaseMeetingSubmissionRecord[];
        return resolve(submissions);
      });
    });

  }

  private emailFoundInSubmissions(subs: FirebaseMeetingSubmissionRecord[], email) {
    return subs.some(s => s.userId === email);
  }

  async addGradesToMoodleCsv(rows: string[][], submissionsId: string): Promise<string[][]> {
    // Each rows has format:
    // [ Identifier, Full name, Email address, Status, Grade, Maximum Grade, etc. ]
    // important fields are email address and grade.
    // 0th row is header row.
    const subs = await this.getSubmissionsForMeeting(submissionsId);
    for (let i = 0; i < rows.length; i++) {
      if (this.emailFoundInSubmissions(subs, rows[i][2])) {
        console.log(`Found ${rows[i][2]} in submissions. Setting grade to 1`);
        rows[i][4] = "1";     // they get credit for attending.
      }
    }
    return rows;
  }

  public async addNewSubmissionsDoc() {
    return await this.db.collection("submissions").add({ submissions: [] });
  }

  public async deleteSubmissions(submissionsId: string) {
    // console.log('deleting all submissions for id ', submissionsId);
    await this.db.doc(submissionsId).delete();
  }
}
