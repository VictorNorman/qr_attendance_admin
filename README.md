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

## Summary of features: 

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
* QR code generation is timestamped, and student attendance submissions are timestamped -- so professors can check if students are actually attending
  a synchronous meeting or not.
* QRCA can handle multiple courses meeting at one time. The professor can generate a meeting and QR Code for more than one course. Students choose their specific course when registering their attendance.
  
## General Usage 

Professors: Follow these instructions to get going using QRCA.

1. Go to the admin page and create a course. Use a unique string for the Course Name. You might include your section in the name or even your name.
   1. The Course Description field is not used at this time, but might be in the future, so I recommend you put a short description there. Something like
   "CS Seminar Course for 1st- and 2nd-year students"
1. Tell your students to go to https://qr-attendance-app.web.app on their phone, and then use a menu in their phone's browser to "Add to Home Screen" (or some such). This will install the PWA as an app on their phone.
1. The first time the students run the app, it will ask for their First and Last Name, and their Calvin email address. This must be entered correctly, if
   you intend to use the feature for uploading attendances to Moodle.  If a student enters this information incorrectly, it cannot be changed.  (Actually, it 
   can be changed, but you'll have to contact me to learn the secret way.)
1. Each time you meet, go to the admin page, select your course (or courses), and click **Add meeting**.  
   1. For the meeting description, you might enter the date/time of the meeting,
   or perhaps the name of the speaker for that day (for a seminar course). This information will be visible to the students in their apps.
   1. For the "Text to encode in a QR", you may enter any text. The text you type will not be visible to you or students (if you are projecting your screen). Any random text here will do.
   1. Click "Create and display QR Code". This will display the QR Code on the page.  Tell your students to use their apps to take a picture of the QR code.
1. Students take a picture of the QR code. They will then be able to enter "Notes" about the meeting. You could require they enter something there, or you could
tell them to ignore this field.



