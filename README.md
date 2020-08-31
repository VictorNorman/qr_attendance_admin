# QR Code Attendance Admin and App Usage Guide

## What is this?

The QR Code Attendance (QRCA) project is a mechanism for professors to 
record attendance at classes. The project consists of an admin website (https://qrattendance-f6b2d.web.app) and
a mobile app. The mobile app is a PWA (Progressive Web App), which means it can be downloaded and installed on a phone without
going through the Google Play Store or Apple App Store. It is found at https://qr-attendance-app.web.app.

QRCA allows the professor to create a QR code with a hidden/secret text for a class meeting at which they would like to 
take attendance. The QR code is displayed on the screen in front of the meeting space (or online in an online meeting). Students, using
the app, take a picture of the QR code, and then can either fill in some notes/feedback from the meeting, or can immediately submit
their attendance. After the event is complete, the professor can view and/or download the attendance list, and can upload the attendance
to an Assignment in a Moodle course, if they wish.

Summary of features: 
* QRCA makes some effort to thwart cheating -- i.e., students saying they attended the meeting but did not.
  * The student registers themselves with the app the first time it is run, and cannot change this information after that. This
    prevents students from running the app twice and registering attendance for a friend who is not actually there.
  * The professor can show the QR Code only for a minute or two, so that students cannot show up an hour late to an event and still register
    themselves as having attended.
  * The text used to create the QR code is not displayed in plain text to the class, so students cannot just send the text to their friends.
  * The professor could use the "notes" field in the app to make sure students stay engaged in the whole class. The professor could at the 
    end of the class, say, tell the class to put a certain text string in the notes field before submitting their attendance.
* With just a few clicks, the professor can automatically record attendance in a Moodle Assignment.  See below for details.
* The professor creates a "course" with a unique name, and can create class meetings thereafter. The professor can see all meetings that have been created
  and their attendance numbers.
* Students will be informed of how many times they have successfully submitted attendance for a course.
    
