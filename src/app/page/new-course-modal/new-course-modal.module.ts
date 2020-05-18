import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCourseModalPageRoutingModule } from './new-course-modal-routing.module';

import { NewCourseModalPage } from './new-course-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCourseModalPageRoutingModule
  ],
  declarations: [NewCourseModalPage]
})
export class NewCourseModalPageModule {}
