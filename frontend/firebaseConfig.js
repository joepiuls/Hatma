// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { RecaptchaVerifier } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";
import { applyActionCode } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ1-Rt2hbaZGueFbf7O3jUF-aJfgGyVPY",
  authDomain: "hatma-bba6d.firebaseapp.com",
  databaseURL: "https://hatma-bba6d-default-rtdb.firebaseio.com",
  projectId: "hatma-bba6d",
  storageBucket: "hatma-bba6d.firebasestorage.app",
  messagingSenderId: "90723742069",
  appId: "1:90723742069:web:641616ccb6e5a28038a33c",
  measurementId: "G-STXYGPFGC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const recaptcha = RecaptchaVerifier;

export {auth, googleProvider, db, recaptcha, signInWithPhoneNumber, applyActionCode}
export default firebaseConfig;