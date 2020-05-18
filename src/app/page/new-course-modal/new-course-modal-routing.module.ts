import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCourseModalPage } from './new-course-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NewCourseModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCourseModalPageRoutingModule {}
