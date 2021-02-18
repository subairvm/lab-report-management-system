# Lab Report Management System

The task was to design a customized report management solution for a Pathology Lab in Delhi, India and it should easily integrate with the existing website of the Pathology Lab. Developed in React.js and Firebase, It offers a robust User Interface for generating and managing reports.

### Features -

1. Secured with Firebase Authentication.
2. Automatically manages refrence number of the reports.
3. Generates the reports in the pdf format and saves the data in Firestore.
4. Supports uploading candidates photos.
5. Provides a search bar to easily search previous reports. Offers 5 filters for searching reports. e.g. Date Examined, Date Expiry, Lab Serial Number, Passport Number, Date of Birth.
6. Easy to use interface for editing reports.
7. Reports automatically expires after 3 months of examined date.
8. Provides a feature for changing or resetting password.

## This app is deployed on Vercel.

## For testing on live url

use email - test@email.com
use password - test123

## To run locally

1. Clone the repository
2. Run `npm install`
3. Add your own credentials of firebase project in .env.local.sample and rename it to .env.local
4. Run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
