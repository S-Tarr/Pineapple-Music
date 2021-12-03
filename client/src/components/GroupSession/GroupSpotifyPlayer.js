import React, { useState, useEffect, useContext } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import app from "../../firebase";
import { getAuth } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDoc,
  getDocs,
  updateDoc,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";
import FastForwardRoundedIcon from "@mui/icons-material/FastForwardRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { TimeContext } from "../../contexts/TimeContext";

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : '0fbe30c6e814404e8324aa3838a7f322',
  clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
  redirectUri: 'localhost:3000/Pineapple-Music'
});

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

{/*ALAN: ADD PLAYLIST TRACKS TO songs below AND REMOVE RELATIVE TO OFFSET SONGS */}
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
          where("queueId", "==", groupSessionId)
        );
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
    queue.push(song.uri);
  });
  return queue;
}

async function getAccessToken() {
  const docSnap = await getDocs(collection(db, "users"));
  let temp = null;
  docSnap.forEach((thing) => {
    if (thing.data().uid === auth.currentUser.uid) {
      temp = thing.data();
      return thing.data();
    }
  });
  return temp;
}

// THOMAS
function GetPermissions(sessionId, setQueueing, setPps) {
  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSession = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSession, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setQueueing(doc.data().queueing);
        setPps(doc.data().pps);
      });
    })
    return () => unsubscribe;
  }, [sessionId]);
}
//

export default function Player({
  groupSessionQueueID,
  groupSessionQueueDoc,
  sessionId,
  docId,
}) {
  const [play, setPlay] = useState(false);
  const [offset, setOffset] = useState(0);
  const {setTime, updateTime, elapsed} = useContext(TimeContext);

  // THOMAS 
  const { checkCreator } = useAuth();
  const [queueing, setQueueing] = useState();
  const [pps, setPps] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const isOwnerPromise = checkCreator(sessionId)
      .then((result) => {
          return result;
      });
  const useOwnerPromise = () => {
      isOwnerPromise.then((result) => {
      if (result) {
          setIsOwner(true);
      } else {
          setIsOwner(false);
      }
      });
  };
  useOwnerPromise();
  GetPermissions(sessionId, setQueueing, setPps);
  //

  useEffect(() => {
    const stateRef = collection(db, "groupSessions");
    const stateQuery = query(stateRef, where("sessionId", "==", sessionId));
    let queueOffset = 0;
    const unsubscribe = onSnapshot(stateQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().playState) {
          setPlay(true);
        } else {
          setPlay(false);
        }
        //ADD IN CREATEOFFSET HERE AS WELL
        setOffset(doc.data().queueOffset);
      });
    });
    return () => unsubscribe;
  }, []);

  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      setAccessToken(ret.SpotifyToken);
    });
  }, [isLoaded]);

  if (accessToken === undefined) {
    setIsLoaded(false);
  }
  spotifyApi.setAccessToken(accessToken);

  const songQueue = GetQueue(
    sessionId,
    groupSessionQueueID,
    groupSessionQueueDoc
  );

  async function handlePlayPause() {
    await updateDoc(doc(db, "groupSessions", docId), {
      playState: !play,
    });
  }

  async function handleSkip() {
    if (offset == songQueue.length - 1) {
      return;
    }

    await updateDoc(doc(db, "groupSessions", docId), {
      queueOffset: offset + 1,
    });
  }

  async function handleReverse() {
    if (offset == 0) {
      return;
    }

    await updateDoc(doc(db, "groupSessions", docId), {
      queueOffset: offset - 1,
    });
  }

  useEffect(()=> {
    const interval = setInterval(async () => {
      updateTime();
    }, 13);
    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!accessToken) return null;
  return (
    <>
      <SpotifyPlayer
        token={accessToken}
        play={play}
        //autoPlay={true}
        uris={songQueue}
        callback={(state) => {
          if (play) {
            state.play = true; //setPlay(false)
          }
          state.offset = offset;
          if (state.track.id != undefined && state.track.id != null &&
            state.track.id != "") {
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
        }}
        offset={offset}
        styles={{
          color: "#FFFFFF",
        }}
      />

      <div className="Player-Div">
        <button className="forward-rewind" disabled={!isOwner && !pps} onClick={() => handleReverse()}>
          <FastRewindRoundedIcon style={{ fontSize: 50 }} />
        </button>
        <button className="playPauseButton" disabled={!isOwner && !pps} onClick={() => handlePlayPause()}>
          {play ? (
            <PauseRoundedIcon style={{ fontSize: 50 }} />
          ) : (
            <PlayArrowRoundedIcon style={{ fontSize: 50 }} />
          )}
        </button>
        <button className="forward-rewind" disabled={!isOwner && !pps} onClick={() => handleSkip()}>
          <FastForwardRoundedIcon style={{ fontSize: 50 }} />
        </button>
      </div>
    </>
  );
}
