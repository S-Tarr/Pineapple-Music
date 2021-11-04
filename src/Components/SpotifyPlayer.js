import React, { useState, useEffect, useContext } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDoc, doc, onSnapshot} from "firebase/firestore";
import { TimeContext } from '../contexts/TimeContext';

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database
function GetQueue() {
  var fakeChange = 0;
  const [songQueue, setSongQueue] = useState();
  const currentUser = auth.currentUser;
  useEffect(() => {
    const queueRef = collection(db, 'userQueue', currentUser.uid, 'queue');
    const queueQuery = query(queueRef, orderBy('addedAt'), limit(25));
    const unsubscribe = onSnapshot(queueQuery, querySnapshot => {
        let queue = [];
        querySnapshot.forEach(doc => {
            var data = doc.data();
            queue.push(data.songUri);
        })
        setSongQueue(queue.reverse());
    })
    return () => unsubscribe;
  }, [])
  return songQueue;
}

async function getAccessToken() {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export default function Player({getTime}) {
  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("")
  const {setTime} = useContext(TimeContext);
  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      setAccessToken(ret.SpotifyToken);
    });
    console.log(accessToken);
  }, [isLoaded])

  if (accessToken == undefined) {
    setIsLoaded(false)
  }
  console.log(isLoaded)

  var play2 = true;
  let queue = GetQueue();
  console.log(queue);
 
  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={state => {
        if (!state.isPlaying) play2 = false;
        else play2 = true;
        setTime({timeStamp: new Date(), elapsed: state.progressMs, isPlaying: play2});
      }}
      play={play2}
      autoPlay={true}
      uris={queue}
    />
  )
}