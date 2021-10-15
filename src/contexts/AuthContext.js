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
} from "firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, setDoc } from "firebase/firestore";
import { ConstructionOutlined } from "@mui/icons-material";

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

const CLIENT_ID = "b85b37966e894d9cb8eb8d776047f000";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/Pineapple-Music"; //TODO CHANGE LATER
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"]; //TODO CHANGE LATER IF NECESSARY
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getParamsFromSpotifyAuth = (hash) => {
  console.log("trying to get the token");
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  return params;
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
          setCurrentUser(userCredential)
          localStorage.clear();
          localStorage.setItem('uid', userCredential.user.uid);
          console.log(userCredential.user.uid);
          console.log("Doc written w/ ID in signup: ");
        } catch (e) {
          console.error("Error adding doc in signup: ");
        }
      }
    );

    return created;
  }

  async function loadPage() {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    const params = await getParamsFromSpotifyAuth(window.location.hash);
    console.log(params)
    return params.access_token;
  }

  async function addSpotifyToken(uid, params) {
    console.log("adding token being called uid", currentUser);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: currentUser.uid,
        SpotifyToken: params
      });
      console.log("Doc written w/ ID in addToken: ", docRef.id);
    } catch (e) {
      console.error("Error adding doc in addToken: ", e);
    }
    return params;
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
    signup,
    login,
    logout,
    addSpotifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
