import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewMeetingPageRoutingModule } from './new-meeting-routing.module';

import { NewMeetingPage } from './new-meeting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewMeetingPageRoutingModule
  ],
  declarations: [NewMeetingPage]
})
export class NewMeetingPageModule {}
