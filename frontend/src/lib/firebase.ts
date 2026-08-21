// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9U4HbJKqhtx43uzQlxFLm4jRGrW_SPPI",
  authDomain: "medmatch-ai-dbd96.firebaseapp.com",
  databaseURL: "https://medmatch-ai-dbd96-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "medmatch-ai-dbd96",
  storageBucket: "medmatch-ai-dbd96.firebasestorage.app",
  messagingSenderId: "333346744808",
  appId: "1:333346744808:web:9e8ec2538d653e0e3c9c5d",
  measurementId: "G-86SM8F69W3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);