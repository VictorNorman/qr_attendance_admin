import { TestBed } from '@angular/core/testing';

import { SelectedCoursesService } from './selected-courses.service';

describe('SelectedCoursesService', () => {
  let service: SelectedCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
