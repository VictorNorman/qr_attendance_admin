import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMeetingPage } from './new-meeting.page';

const routes: Routes = [
  {
    path: '',
    component: NewMeetingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewMeetingPageRoutingModule {}
