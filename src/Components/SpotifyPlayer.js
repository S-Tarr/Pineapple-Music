import React, { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, where, addDoc, query, orderBy, limit, getDocs, onSnapshot, Timestamp } from "firebase/firestore";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

function GetQueue() {
  const [songQueue, setSongQueue] = useState();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const queueRef = collection(db, 'userQueue', currentUser.uid, 'queue');
    const queueQuery = query(queueRef, orderBy('addedAt'), limit(25));
    const unsubscribe = onSnapshot(queueQuery, querySnapshot => {
        let queue = [];
        querySnapshot.forEach(doc => {
            queue.push(doc.data());
        })
        setSongQueue(queue);
    })
    return () => unsubscribe;
  }, [])

  return songQueue;
}

export default function Player({ accessToken, trackUri }) {

  const [play, setPlay] = useState(false)
  const [songUri, setSongUri] = useState(trackUri);
  const [firstSong, setFirstSong] = useState(true);
  let queue = []
  queue = GetQueue();
  console.log(queue);
  //var songUri = trackUri;
  //setSongUri(trackUri);
  var songIndex = 0;

  useEffect(() => {
    setPlay(true);
    if (!firstSong) {
      setSongUri(queue[++songIndex]);
      console.log(queue[songIndex]);
    }
    setFirstSong(false);
  })


  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={songUri ? [songUri] : []}
      autoPlay={true}
    />
  )
}