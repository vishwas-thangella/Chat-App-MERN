// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY5PJ8etLEMmtb3zi7_0-V44Q6ppR79jQ",
  authDomain: "chatappv1-cd0c0.firebaseapp.com",
  projectId: "chatappv1-cd0c0",
  storageBucket: "chatappv1-cd0c0.appspot.com",
  messagingSenderId: "962240641945",
  appId: "1:962240641945:web:be0f918a5e7fec9210b108",
  measurementId: "G-ZEL18WFRP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const Storage = getStorage(app);
