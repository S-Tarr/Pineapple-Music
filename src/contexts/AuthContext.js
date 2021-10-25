/**
 * Establishes the firebase connection and builds a React context storing logged in user information.
 *
 * Contexts:
 * "In a typical React application, data is passed top-down (parent to child) via props,
 * but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme)
 * that are required by many components within an application. Context provides a way to share
 * values like these between components without having to explicitly pass a prop through every
 * level of the tree."
 */

// Imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_IknUnLChJp9vG9kip0_Xu1YaqKed2Sk",
  authDomain: "pineapple-music-1ea51.firebaseapp.com",
  projectId: "pineapple-music-1ea51",
  storageBucket: "pineapple-music-1ea51.appspot.com",
  messagingSenderId: "171412581022",
  appId: "1:171412581022:web:bd4f9b6de4f7de0c17a98f",
  measurementId: "G-QZK0B417MX",
};

// Initialize Firebase components
const app = initializeApp(firebaseConfig); // Connected app instance
const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

// Initialize AuthContext
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * @returns The current user; can be used anywhere in the application
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  /**
   * Calls the firebase function to signup with username and password.
   */
  async function signup(email, password) {
    //const params = {access_token: "hello this is kichul testing testing"};

    const created = createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        try {
          setCurrentUser(userCredential);
          console.log("Doc written w/ ID in signup: ");
        } catch (e) {
          console.error("Error adding doc in signup: ");
        }
      }
    );

    return created;
  }

  async function addGroupSession(name, sessionId) {
    try {
      const songs = [];
      const docRef = await addDoc(collection(db, "groupSessions"), {
        createdAt: Timestamp.now(),
        name: name,
        ownerUid: currentUser.uid,
        sessionId: sessionId
      });
      const docRef2 = await addDoc(collection(db, "groupSessionQueue"), {
        createdAt: Timestamp.now(),
        queueId: docRef.id,
        sessionId: sessionId,
        songs : songs
      });
      console.log("Doc written w/ ID in addGroupSession: ", docRef.id);
    } catch (e) {
      console.error("Error adding doc in addGroupSession: ", e);
    }
  }

  async function addSpotifyToken(params) {
    console.log("adding token being called uid, currentUser:", currentUser);

    try {
      if (currentUser !== undefined) {
        const docSnap = await getDocs(collection(db, "users"));
        let exists = false;
        docSnap.forEach((doc) => {
          if (doc.data().uid === currentUser.uid) {
            exists = true;
          }
        });
        if (exists) {
          console.log("uid already exists:");
        } else {
          const docRef = await addDoc(collection(db, "users"), {
            uid: currentUser.uid,
            SpotifyToken: params,
            createdAt: Timestamp.now(),
          });
          console.log("Doc written w/ ID in addToken: ", docRef.id);
        }
      }
    } catch (e) {
      console.error("Error adding doc in addToken: ", e);
    }
  }

  function deleteAccount() {
    return deleteUser(auth.currentUser);
  }

  /**
   * Calls the firebase function to login with a username and password.
   */
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Calls the firebase function to logout the current user.
   */
  function logout() {
    return signOut(auth);
  }

  /**
   * Sets the current user when the state changes and unsubscribes from the listener after.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    //addUserToFirestore,
    signup,
    deleteAccount,
    login,
    logout,
    addSpotifyToken,
    addGroupSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
