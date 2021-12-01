/**
 * Connects project to firebase.
 */

// Import the functions you need from SDKs
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_IknUnLChJp9vG9kip0_Xu1YaqKed2Sk",
  authDomain: "pineapple-music-1ea51.firebaseapp.com",
  projectId: "pineapple-music-1ea51",
  storageBucket: "pineapple-music-1ea51.appspot.com",
  messagingSenderId: "171412581022",
  appId: "1:171412581022:web:bd4f9b6de4f7de0c17a98f",
  measurementId: "G-QZK0B417MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

export const auth = getAuth() // Authorization component from Firebase

export default app