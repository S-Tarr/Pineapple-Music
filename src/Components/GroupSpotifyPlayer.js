import React, { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDoc, getDocs, where, doc, onSnapshot} from "firebase/firestore";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database
/*function GetQueue(groupSessionQueueID) {
  const [songQueue, setSongQueue] = useState();
  const currentUser = auth.currentUser;
  useEffect(() => {
    const queueRef = collection(db, 'groupSessionQueue', groupSessionQueueID);
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
}*/
function GetQueue(sessionId, groupSessionQueueId, groupSessionQueueDoc) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        setSongs([]);
        const groupSessionRef = collection(db, "groupSessions");
        const groupSession = query(
            groupSessionRef,
            where("sessionId", "==", sessionId)
        );
        let groupSessionId;
        getDocs(groupSession).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                groupSessionId = doc.id;

                const groupSessionQueueRef = collection(db, "groupSessionQueue");

                const groupSessionQueue = query(
                    groupSessionQueueRef,
                    where("queueId", "==" , groupSessionId)
                )
                getDocs(groupSessionQueue).then((querySnapshot) => {
                    let SongsInSession = [];
                    querySnapshot.forEach((doc) => {
                        groupSessionQueueId = doc.id;
                        groupSessionQueueDoc = doc.data();
                        SongsInSession = doc.data().songs;
                    });
                    setSongs(SongsInSession);
                });
            });
          });

    }, []);
    let queue = [];
    songs.forEach((song) => {
        queue.push(song.uri)
    })
    console.log(queue);
    console.log(songs);
    return queue;
}

async function getAccessToken() {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export default function Player({ groupSessionQueueID, groupSessionQueueDoc, sessionId }) {

  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("")
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

  
  const [play, setPlay] = useState(false)
  let queue = GetQueue(sessionId, groupSessionQueueID, groupSessionQueueDoc);
  console.log(queue);
 
  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={state => {
        if (!state.isPlaying) console.log("shit")//setPlay(false)
      }}
      play={play}
      autoPlay={true}
      uris={queue}
    />
  )
}