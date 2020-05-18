import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.page.html',
  styleUrls: ['./new-meeting.page.scss'],
})
export class NewMeetingPage implements OnInit {

  public qrGenerated = false;
  public qrEncodedString = '';
  public notes = '';
  public duration = 3;    // minutes, by default

  constructor() { }

  ngOnInit() {
  }

  generateQRCode() {
    if (this.qrEncodedString) {
      this.qrGenerated = true;
    }
  }
}
