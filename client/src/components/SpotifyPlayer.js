import React, { useState, useEffect, useContext, useRef } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, collection, query, orderBy, limit, getDocs, where, onSnapshot} from "firebase/firestore";
import { TimeContext } from '../contexts/TimeContext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import RefreshIcon from '@mui/icons-material/Refresh';
import "./Components.css"
import { stat } from "fs";
import { off } from "process";

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : '0fbe30c6e814404e8324aa3838a7f322',
  clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
  redirectUri: 'localhost:3000/Pineapple-Music'
});

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
  const docSnap = await getDocs(collection(db, "users"));
  console.log(auth.currentUser.uid)
  let temp = null;
  docSnap.forEach((thing) => {
    console.log(thing.data().uid)
    if (thing.data().uid == auth.currentUser.uid) {
      temp = thing.data();
      
    }
  });
  console.log(temp)
  return temp;
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function Player(props) {
  const {setTime, updateTime, elapsed, updateBook} = useContext(TimeContext);
  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [update, setUpdate] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [shouldSkip, setShouldSkip] = useState(false)
  const [currentSongId, setCurrentSongId] = useState("");
  const [bookmarkTime, setBookmarkTime] = useState(-1);
  const [offset, setOffset] = useState(0);
  const [skipped, setSkipped] = useState(false);
  
  const { addBookmark } = useAuth();
  const dictRef = useRef();

  var bookmarkDict = {}

  spotifyApi.setAccessToken(props.accessToken);

  //console.log("Token: " + accessToken)

  if (accessToken == undefined) {
    setIsLoaded(false)
  }


  var play2 = true;

  const auth = getAuth(); // Authorization component
  const db = getFirestore(app); // Firestore database

  useEffect(() => {
    console.log("update: " + update);
  }, [update]);

  function handleBookmark() {
    console.log("id: " + currentSongId);
    setUpdate(!update);
    setShouldUpdate(true);
    // forceUpdate;
  } 

  async function refreshBookmarks() {
    // console.log("offset:", offset)
    console.log("refreshing...")
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const qSnap = await getDocs(q);
    qSnap.forEach((doc) => {
      // console.log("trackid: " + currentSongId + " " + "data: " + value)
      if (currentSongId && doc.data().bookmarks) {
        for (const [key, value] of Object.entries(doc.data().bookmarks)) {
          bookmarkDict[key] = (value["time"]);
        }
        dictRef.current = bookmarkDict;
        // console.log("trackid: " + currentSongId + " " + "data: " + value)
        // console.log("trackid: " + currentSongId + " " + "uid: " + doc.data().uid + " " + "data: " + key + "; " + value)
      }
    });
    // setBookmarkTime(thing.data.bookmarks[id])
  }

  function temp() {
    setOffset(offset + 1);
    setSkipped(true)
    console.log(skipped)
    console.log("offset:", offset)
  }
  // async function findBookmarkTime(id) {
  //   const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
  //   const qSnap = await getDocs(q);
  //   qSnap.forEach((doc) => {
  //     if (id) {
  //       if (!doc.data().bookmarks[id]) {
  //         setBookmarkTime(-1);
  //       }
  //       const[key, value] = Object.entries(doc.data().bookmarks[id])
  //       console.log("trackid: " + currentSongId + " " + "data: " + value)
  //       // console.log("trackid: " + currentSongId + " " + "uid: " + doc.data().uid + " " + "data: " + key + "; " + value)
  //       setBookmarkTime(value)
  //     }
  //   });
  // }

  useEffect(() => {
    // console.log("songid: " + currentSongId)
    if (dictRef.current) {
      if (dictRef.current.hasOwnProperty(currentSongId)) {
        console.log("skip?: " + elapsed, dictRef.current[currentSongId])
        if (elapsed > dictRef.current[currentSongId]) {
          console.log("SKIP")
          setSkipped(true)
          temp()
          console.log("setting useeffect " + skipped)
          // setShouldSkip(true)
        }
      }
    }
  }, [elapsed])

  useEffect(() => {
    if (shouldSkip) {
      console.log("changing offset")
      // setOffset(offset + 1)
    }
    let timer1 = setTimeout(() => setShouldSkip(false), 9000);
    return () => {
      clearTimeout(timer1);
    };
  }, [shouldSkip])
  

  useEffect(()=> {
    const interval = setInterval(async () => {
      updateTime();
    }, 13);
    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    const interval2 = setInterval(async() => {
      updateBook();
    }, 1000);
  }, [isLoaded]);

  if (!props.accessToken) return null;
  return (
    <div style={{width: "100%", display: "flex"}}>
      <SpotifyPlayer
        token={props.accessToken}
        uris={props.songQueue}
        play={play2}
        autoPlay={true}
        callback={(state) => {
          console.log("CALLED BACK HOLY SHIT!!!!!!")
          // state.offset = offset
          
          console.log(state.offset)

          if (skipped) {
            console.log("OMGGGGGGGGGG")
            state.needsUpdate = true
            setSkipped(false)
          }

          if (state.isPlaying) {
            play2 = true;
          }
          else {
            play2 = false;
          }
          console.log("Track id: " + state.track.id);
          setCurrentSongId(state.track.id);
          // setOffset(state.previousTracks.length);
          console.log("offset :", offset)

          refreshBookmarks();

          if (state.track.id != undefined && state.track.id != null &&
            state.track.id != "") {
          //console.log("Track id: " + state.track.id);
            spotifyApi.getAudioAnalysisForTrack(state.track.id)
            .then(function(data) {
              setTime({timeStamp: new Date(), elapsed: state.progressMs,
              isPlaying: state.isPlaying, beats: data.body.beats, segments: data.body.segments,
              song: state.track.id});
            }, 
            function(err) {
              console.log("API ERROR: " + err);
            });
          }
          if (shouldUpdate) {
            console.log("reachedupdate")
            addBookmark(state.track.id, state.progressMs, state.track.name)
            setUpdate(!update);
            setShouldUpdate(false);
            state.isPlaying = !update;
          }
        }}
        play = {update}
        offset = {offset}
      />

      <button button className="bookmark-button" onClick = {() => handleBookmark()}>
          <BookmarkBorderIcon style={{ fontSize: 50 }} />
      </button>
      <button button className="bookmark-button" onClick = {() => refreshBookmarks()}>
          <RefreshIcon style={{ fontSize: 50 }} />
      </button>
      <button button className="bookmark-button" onClick = {() => temp()}>
          AHHHH
      </button>
    </div>
    
      
        

  )
}