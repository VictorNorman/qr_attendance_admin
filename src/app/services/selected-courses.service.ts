import { Injectable } from '@angular/core';

//
// This is a silly little service that stores selected course names. The home page sets them, 
// and the new-meeting page gets them. But, passing a list of course names in parameters turned
// out to be problematic, so this was an easy way to do it.
//
@Injectable({
  providedIn: 'root'
})
export class SelectedCoursesService {

  private courseNames: string[] = [];

  constructor() { }

  setNames(names) {
    this.courseNames = names;
  }

  getNames() {
    return this.courseNames;
  }
}
