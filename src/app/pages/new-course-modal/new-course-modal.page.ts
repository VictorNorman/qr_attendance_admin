import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-course-modal',
  templateUrl: './new-course-modal.page.html',
  styleUrls: ['./new-course-modal.page.scss'],
})
export class NewCourseModalPage implements OnInit {

  public courseName = '';
  public adminEmail = '';
  public password = '';
  public description = '';

  constructor(private mCtrl: ModalController) { }

  ngOnInit() {
  }

  done() {
    this.mCtrl.dismiss({
      courseName: this.courseName,
      adminEmail: this.adminEmail,
      password: this.password,      // not used right now.
      description: this.description,
    });
  }

}
