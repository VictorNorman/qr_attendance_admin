import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface FirebaseCourseRecord {
  adminEmail: string;
  password: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // list of course names
  private courses: FirebaseCourseRecord[] = [];

  public coursesSubj: BehaviorSubject<FirebaseCourseRecord[]> = new BehaviorSubject<FirebaseCourseRecord[]>(undefined);

  constructor(
    private db: AngularFirestore,
  ) {
    this.db.collection<FirebaseCourseRecord>('/courses').snapshotChanges().subscribe(docChActions => {
      this.courses = [];
      docChActions.forEach(dca => {
        const course = dca.payload.doc.data();
        this.courses.push({
          name: course.name,
          adminEmail: course.adminEmail,
          description: course.description,
          password: course.password,
        });
      });
      // Tell all subscribers that the data has arrived.
      this.coursesSubj.next(this.courses);
    });
  }

  async addNewCourse(name: string, adminEmail: string, password: string, description: string) {
    // Create a new meetings document first, and get the id of it. Use that when
    // creating the course. The document contains an array of meetings, which starts out empty.
    const meetingsDocRef = await this.db.collection('meetings').doc(name).set({ mtgs: [] });

    // Using add() will generate a unique document id.
    this.db.collection('courses').add({
      adminEmail,
      name,
      password,
      description,
    });
  }
}

