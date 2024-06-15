// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApsRlDTR2lG2KHTZaEcHPtrtSb6iJD1UA",
  authDomain: "dodoru-28c37.firebaseapp.com",
  projectId: "dodoru-28c37",
  storageBucket: "dodoru-28c37.appspot.com",
  messagingSenderId: "124518029812",
  appId: "1:124518029812:web:67ac567bc6051b688901a1"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db, collection, addDoc };