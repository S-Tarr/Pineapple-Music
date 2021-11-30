import { useState, useEffect } from "react"
import axios from "axios"
// import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
// import { collection, getDocs } from "firebase/firestore";

// const auth = getAuth(); // Authorization component
// const db = getFirestore(app); // Firestore database

// async function getAccessToken() {
//   const docSnap = await getDocs(collection(db, "users"));
//   console.log(auth.currentUser.uid)
//   let temp = null;
//   docSnap.forEach((thing) => {
//     console.log(thing.data().uid)
//     if (thing.data().uid == auth.currentUser.uid) {
//       temp = thing.data();
//       userDocId = thing.id;
//       console.log("uid: " + userDocId)
//       console.log(temp)
//     }
//   });
//   console.log(temp)
//   return temp;
// }

export default function useAuth(code) {

  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        console.log("amde it here")
        //window.history.pushState({}, null, "/Pineapple-Music")
      })
      .catch((err) => {
        //window.location = "/Pineapple-Music"
        console.log("code issue: " + code + " " + err)
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = "/Pineapple-Music"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}