// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgld84EOceSq6VQD9eEOqFtkO4q6RoyeM",
  authDomain: "tms-software-910e6.firebaseapp.com",
  projectId: "tms-software-910e6",
  storageBucket: "tms-software-910e6.appspot.com",
  messagingSenderId: "198681523347",
  appId: "1:198681523347:web:15638896b6f02b83bc8966"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()