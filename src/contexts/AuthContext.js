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
  doc,
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  getDocs,
  updateDoc,
  arrayUnion,
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

  function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function compare(dateA, dateB) {
    var a = Date.parse(dateA.createdAt.toString());
    var b = Date.parse(dateB.createdAt.toString());
    return a < b ? 1 : a > b ? -1 : 0;
  }

  async function joinGroupSession(sessionId) {
    try {
      const docSnapSessions = await getDocs(collection(db, "groupSessions"));
      docSnapSessions.forEach((currDoc) => {
        if (currDoc.data().sessionId === sessionId) {
          const sessionRef = doc(db, "groupSessions", currDoc.id);
          console.log("sessionRef", sessionRef);
          updateDoc(sessionRef, {
            users: arrayUnion(currentUser.uid),
          });
        }
      });
      const docSnapUsers = await getDocs(collection(db, "users"));
      docSnapUsers.forEach((currDoc) => {
        if (currDoc.data().uid === currentUser.uid) {
          const userRef = doc(db, "users", currDoc.id);
          updateDoc(userRef, {
            groupSessions: arrayUnion(sessionId),
          });
        }
      });
    } catch (e) {
      console.error("Error getting doc in joining groupSession: ", e);
    }
  }

  async function searchGroupSessions(inputId) {
    let cards = [];
    try {
      if (currentUser !== undefined) {
        const docSnap = await getDocs(collection(db, "groupSessions"));
        docSnap.forEach((doc) => {
          const props = {
            title: "group session1",
            imageUrl:
              "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
            username: "username goes here",
            createdAt: "",
            sessionId: 1234,
          };
          if (doc.data().sessionId === inputId) {
            var date = getFormattedDate(
              new Date(doc.data().createdAt.seconds * 1000)
            );
            props["createdAt"] = date;
            props["title"] = doc.data().name;
            props["username"] = doc.data().ownerUid;
            props["sessionId"] = doc.data().sessionId;
            cards.push(props);
          }
        });
      }
    } catch (e) {
      console.error("Error getting doc in searchGroupSessions: ", e);
    }

    cards.sort(compare);
    return cards;
  }

  async function getYourGroupSessions() {
    let cards = [];
    try {
      if (currentUser !== undefined) {
        console.log("getting group sessions: ", currentUser.uid);
        const docSnap = await getDocs(collection(db, "groupSessions"));
        docSnap.forEach((doc) => {
          const props = {
            title: "group session1",
            imageUrl:
              "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
            username: "username goes here",
            createdAt: "",
            sessionId: 1234,
          };
          if (doc.data().ownerUid === currentUser.uid) {
            console.log(doc.data());
            var date = getFormattedDate(
              new Date(doc.data().createdAt.seconds * 1000)
            );
            props["createdAt"] = date;
            props["title"] = doc.data().name;
            props["username"] = doc.data().ownerUid;
            props["sessionId"] = doc.data().sessionId;
            cards.push(props);
          }
        });
      }
    } catch (e) {
      console.error("Error getting doc in getYourGroupSessions: ", e);
    }
    return cards;
  }

  async function getGroupSessions() {
    let cards = [];
    try {
      if (currentUser !== undefined) {
        let currGroupSessions = new Set();
        const docSnap = await getDocs(collection(db, "users"));
        docSnap.forEach((doc) => {
          if (doc.data().uid === currentUser.uid) {
            doc
              .data()
              .groupSessions.forEach((item) => currGroupSessions.add(item));
          }
        });
        const docSnapSessions = await getDocs(collection(db, "groupSessions"));
        docSnapSessions.forEach((doc) => {
          const props = {
            title: "group session1",
            imageUrl:
              "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
            username: "username goes here",
            createdAt: "",
            sessionId: 1234,
          };
          if (currGroupSessions.has(doc.data().sessionId)) {
            var date = getFormattedDate(
              new Date(doc.data().createdAt.seconds * 1000)
            );
            props["createdAt"] = date;
            props["title"] = doc.data().name;
            props["username"] = doc.data().ownerUid;
            props["sessionId"] = doc.data().sessionId;
            cards.push(props);
          }
        });
      }
    } catch (e) {
      console.error("Error getting doc in getGroupSessions: ", e);
    }

    cards.sort(compare);
    return cards;
  }

  async function addGroupSession(name, sessionId) {
    try {
      const songs = [];
      const docRef = await addDoc(collection(db, "groupSessions"), {
        createdAt: Timestamp.now(),
        name: name,
        ownerUid: currentUser.uid,
        sessionId: sessionId,
        users: [currentUser.uid],
      });
      const docRef2 = await addDoc(collection(db, "groupSessionQueue"), {
        createdAt: Timestamp.now(),
        queueId: docRef.id,
        sessionId: sessionId,
        songs: songs,
      });
      console.log("Doc written w/ ID in addGroupSession: ", docRef.id);
      const docSnap = await getDocs(collection(db, "users"));
      docSnap.forEach((currDoc) => {
        if (currDoc.data().uid === currentUser.uid) {
          console.log("trying to add group sessions under users", doc);
          const userRef = doc(db, "users", currDoc.id);

          updateDoc(userRef, {
            groupSessions: arrayUnion(sessionId),
          });
          console.log(currDoc.data().groupSessions);
        }
      });
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
    getYourGroupSessions,
    searchGroupSessions,
    getGroupSessions,
    joinGroupSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
