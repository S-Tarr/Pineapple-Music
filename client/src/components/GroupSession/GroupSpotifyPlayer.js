import React, { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import app from "../../firebase";
import { getAuth } from "firebase/auth";
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
  console.log(queue);
  console.log(songs);
  return queue;
}

async function getAccessToken() {
  const docSnap = await getDocs(collection(db, "users"));
  console.log(auth.currentUser.uid)
  let temp = null;
  docSnap.forEach((thing) => {
    console.log(thing.data().uid)
    if (thing.data().uid == auth.currentUser.uid) {
      temp = thing.data();
      console.log(temp)
    }
  });
  console.log(temp)
  return temp;
}

export default function Player({
  groupSessionQueueID,
  groupSessionQueueDoc,
  sessionId,
  docId,
}) {
  const [play, setPlay] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const stateRef = collection(db, "groupSessions");
    const stateQuery = query(stateRef, where("sessionId", "==", sessionId));
    const unsubscribe = onSnapshot(stateQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().playState) {
          setPlay(true);
        } else {
          setPlay(false);
        }
        // console.log(doc.data().queueOffset);
        setOffset(doc.data().queueOffset);
        // console.log(doc.data().queueOffset, offset);
      });
    });
    return () => unsubscribe;
  }, []);

  // useEffect (() => {
  //   const stateRef = collection(db, "groupSessions")
  //   const stateQuery = query(stateRef, where("sessionId", "==", sessionId))
  //   const unsubscribe = onSnapshot(stateQuery, (querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         setOffset(doc.data().offset);
  //       })
  //   });
  //   return () => unsubscribe;
  // }, []);

  const [isLoaded, setIsLoaded] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      if (ret != null && ret !== undefined && ret !== "undefined") {
        setAccessToken(ret.SpotifyToken);
      }
    });
    console.log(accessToken);
  }, [isLoaded]);

  if (accessToken == undefined) {
    setIsLoaded(false);
  }
  console.log(isLoaded);

  const songQueue = GetQueue(
    sessionId,
    groupSessionQueueID,
    groupSessionQueueDoc
  );

  // setQueue(temp)
  // console.log(songQueue);
  // const temp = GetQueue(sessionId, groupSessionQueueID, groupSessionQueueDoc);

  // useEffect(() => {
  //   setQueue(temp);
  // }, [])
  console.log(songQueue);

  //   const [player, setPlayer] = useState(undefined);
  //   useEffect(() => {
  //     const script = document.createElement("script");
  //     script.src = "https://sdk.scdn.co/spotify-player.js";
  //     script.async = true;

  //     document.body.appendChild(script);

  //     window.onSpotifyWebPlaybackSDKReady = () => {

  //         const player = new window.Spotify.Player({
  //             name: 'Web Playback SDK',
  //             getOAuthToken: cb => getAccessToken(),
  //             volume: 0.5
  //         });

  //         setPlayer(player);

  //         player.addListener('ready', ({ device_id }) => {
  //             console.log('Ready with Device ID', device_id);
  //         });

  //         player.addListener('not_ready', ({ device_id }) => {
  //             console.log('Device ID has gone offline', device_id);
  //         });

  //         player.connect();

  //     };
  //   }, []);
  async function handlePlayPause() {
    console.log(songQueue);
    await updateDoc(doc(db, "groupSessions", docId), {
      playState: !play,
    });
  }

  async function handleSkip() {
    // setQueue(queue.slice(queue.indexOf(uri)));
    if (offset == songQueue.length - 1) {
      // setOffset(songQueue.len - 1);
      return;
    }

    // console.log("skip: " + offset);
    await updateDoc(doc(db, "groupSessions", docId), {
      queueOffset: offset + 1,
    });
  }

  async function handleReverse() {
    if (offset == 0) {
      // setOffset(0);
      return;
    }

    // console.log("reverse: " + offset);
    await updateDoc(doc(db, "groupSessions", docId), {
      queueOffset: offset - 1,
    });
  }

  if (!accessToken) return null;
  return (
    <>
      <SpotifyPlayer
        token={accessToken}
        callback={(state) => {
          if (play) {
            console.log("shit");
            state.play = true; //setPlay(false)
          }
          state.offset = offset;
        }}
        play={play}
        //autoPlay={true}
        uris={songQueue}
        offset={offset}
        styles={{
          color: "#FFFFFF",
        }}
      />

      <div className="Player-Div">
        <button className="forward-rewind" onClick={() => handleReverse()}>
          <FastRewindRoundedIcon style={{ fontSize: 50 }} />
        </button>
        <button className="playPauseButton" onClick={() => handlePlayPause()}>
          {play ? (
            <PauseRoundedIcon style={{ fontSize: 50 }} />
          ) : (
            <PlayArrowRoundedIcon style={{ fontSize: 50 }} />
          )}
        </button>
        <button className="forward-rewind" onClick={() => handleSkip()}>
          <FastForwardRoundedIcon style={{ fontSize: 50 }} />
        </button>
      </div>
    </>
  );
}
