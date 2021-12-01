import React, { useState, useEffect, useContext } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, onSnapshot} from "firebase/firestore";
import { TimeContext } from '../contexts/TimeContext';
import { Done } from "@material-ui/icons";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import "./Components.css"

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

export default function Player() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [needUpdate, setNeedUpdate]= useState(false);

  const {setTime} = useContext(TimeContext);
  const { addBookmark } = useAuth();

  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      setAccessToken(ret.SpotifyToken);
      console.log(ret.SpotifyToken)
      console.log(accessToken)
      spotifyApi.setAccessToken(ret.SpotifyToken);
    });
    console.log(accessToken);
  }, [isLoaded])

  console.log(accessToken)

  if (accessToken == undefined) {
    setIsLoaded(false)
  }
  console.log(isLoaded)

  var play2 = true;
  let queue = GetQueue();
  console.log(queue);
  

  const auth = getAuth(); // Authorization component
  const db = getFirestore(app); // Firestore database
  function handleBookmark() {
    console.log("button pressed");
    setNeedUpdate(true)
    console.log("needupdate: " + needUpdate)
  }
  
  if (!accessToken) return null;
  return (
    <div style={{width: "100%", display: "flex"}}>
      <SpotifyPlayer
        token={accessToken}
        play={play2}
        autoPlay={true}
        callback={state => {
          if (!state.isPlaying) play2 = false;
          else play2 = true;
          console.log("Track id" + state.track.id);
          if (state.track.id != undefined && state.track.id != null) {
            // spotifyApi.getAudioAnalysisForTrack(state.track.id)
            // .then(function(data) {
            //   console.log("Beats Info: " + data.body.beats);
            //   setTime({timeStamp: new Date(), elapsed: state.progressMs,
            //   isPlaying: play2, beats: data.body.beats, segments: data.body.segments});
            // }, 
            // function(err) {
            //   console.log(err);
            // });
          }
          console.log("reached callback")
          if (needUpdate) {
            console.log("reachedupdate")
            addBookmark(state.track.id, state.progressMs)
            setNeedUpdate(false);
          }
        }}
        uris={queue}
      />

      <button button className="bookmark-button" onClick={() => handleBookmark()}>
          <BookmarkBorderIcon style={{ fontSize: 50 }} />
      </button>
    </div>
  )
}