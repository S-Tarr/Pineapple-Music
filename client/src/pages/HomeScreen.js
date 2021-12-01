import React from 'react'
import useAuth from "../GetSpotifyAuth"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, updateDoc, getDocs, doc } from "firebase/firestore";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

async function handleSubmitDate(access_token) {
    const docSnap = await getDocs(collection(db, "users"));
    console.log(auth.currentUser.uid)
    docSnap.forEach((data) => {
      if (data.data().uid === auth.currentUser.uid) {
        var today = new Date()
        var date = today.getMonth() + "/" + today.getDay() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
        updateDoc(doc(db, "users", data.id), {
          LastedLoggedIn: date
        });
      }
    });
    console.log(`submitted token` + access_token)
  }

export default function HomeScreen({ code }) {

    console.log(useAuth(code))
    handleSubmitDate();

    return <div className="home">
                {/* <div className="home-bg-box">
                    <img className="home-bg" src={bg} alt="background"/>
                </div> */}
                <h1>Home</h1>
                <h2 font-size=".5rem" just ify-content="center">
                Welcome to Pineapple Music. Our goal was to create a user-friendly
                platform for everyone to enjoy their favorite music together! Take a
                look around and have fun!
                </h2>
                <a href="https://github.com/S-Tarr/Pineapple-Music">Visit our Github!</a>
            </div>
}

