import React, { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDoc, doc, onSnapshot} from "firebase/firestore";
import { useScrollTrigger } from "@material-ui/core";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database



export default function Player() {

  const [accessToken, setAccessToken] = useState("")
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const coRef = collection(db, 'users');
    const docRef = doc(coRef, auth.currentUser.uid);
    const docSnap = getDoc(docRef);
    docSnap.data().then((ret) => {
      setAccessToken(ret.SpotifyToken);
    });
    console.log(accessToken);
  })
  useEffect(() => { 
      let tempQueue = [];
      const currentUser = auth.currentUser;
      const queueRef = collection(db, 'userQueue', currentUser.uid, 'queue');
      const queueQuery = query(queueRef, orderBy('addedAt'), limit(25));
      onSnapshot(queueQuery, querySnapshot => {
        querySnapshot.forEach(doc => {
            var data = doc.data();
            tempQueue.push(data.songUri);
        })
      })
      setQueue(tempQueue.reverse());

  })
  
  const [play, setPlay] = useState(false);
 
  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      autoPlay={true}
      uris={queue}
    />
  )
}