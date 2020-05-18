import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewMeetingPageRoutingModule } from './new-meeting-routing.module';

import { NewMeetingPage } from './new-meeting.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewMeetingPageRoutingModule,
    NgxQRCodeModule,
  ],
  declarations: [NewMeetingPage]
})
export class NewMeetingPageModule {}
