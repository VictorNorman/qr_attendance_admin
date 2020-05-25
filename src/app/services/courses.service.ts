import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface FirebaseCourseRecord {
  id?: string;           // id of the entire record.
  adminEmail: string;
  password: string;
  name: string;
  notes: string;
  meetingsDoc?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // list of course names
  private courses: FirebaseCourseRecord[] = [];
  private courseCollection: AngularFirestoreCollection<FirebaseCourseRecord[]> = undefined;

  public coursesSubj: BehaviorSubject<FirebaseCourseRecord[]> = new BehaviorSubject<FirebaseCourseRecord[]>(undefined);

  constructor(
    private db: AngularFirestore,
  ) { }

  loadAllData() {
    if (this.courses.length !== 0) {
      return;
    }

    this.courses = [];
    this.courseCollection = this.db.collection<FirebaseCourseRecord[]>('courses');

    this.courseCollection.get().subscribe(q => {

      console.log('😀😀😀😀😀: courses subscription fired');
      q.forEach(d => {
        this.courses.push({
          id: d.id,
          name: d.data().name,
          adminEmail: d.data().adminEmail,
          notes: d.data().notes,
          password: d.data().password,
          meetingsDoc: d.data().meetingsDoc || '',
        });
      });
      // Tell all subscribers that the data has arrived.
      this.coursesSubj.next(this.courses);
    });
  }

  async addNewCourse(name: string, adminEmail: string, password: string, notes: string) {
    // Create a new meetings document first, and get the id of it. Use that when 
    // creating the course. The document contains an array of meetings, which starts out empty.
    const meetingsDocRef = await this.db.collection('meetings').add({mtgs: []});

    // Using add() will generate a unique document id.
    this.db.collection('courses').add({
      adminEmail,
      name,
      password,
      notes,
      meetingsDoc: meetingsDocRef.id,
    });
  }
}

