import { useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import Player from '../components/SpotifyPlayer';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg';
import Canvas from "../components/Canvas";
import Button from "@mui/material/Button";
import TimeContextProvider from "../contexts/TimeContext";
import "./Pages.css"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, onSnapshot} from "firebase/firestore";

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
  let temp = null;
  docSnap.forEach((thing) => {
    if (thing.data().uid == auth.currentUser.uid) {
      temp = thing.data();
      
    }
  });
  return temp;
}

const SongPage = () => {
    const [visuals, setVisuals] = useState(false);
    const [text, setText] = useState("Visuals");
    const track = useLocation();
    const [token, setToken] = useState("");
    var isLoaded = true;
    useEffect(() => {
        var promise = getAccessToken();
        promise.then((ret) => {
        setToken(ret.SpotifyToken);
        });
    }, [isLoaded])

    console.log("Token: " + token)

    let queue = GetQueue();
    var image = Pineapple;
    var name = 'example name';
    var uri = null;
    if (track.state) {
        image = track.state.picture;
        name = track.state.name;
        uri = track.state.trackUri;
    }
    const toggleVisuals = () => {
        if (visuals) {
            setVisuals(false);
        }
        else {
            setVisuals(true);
        }
    }
    const toggleText = () => {
        if (visuals) {
            setText("Visuals");
        }
        else {
            setText("Song");
        }
    }
    
    return (
    <div className="Page">
        <Button variant="text"
        onClick={() => {toggleVisuals(); toggleText()}}>
            {text}
        </Button>
            <div className="Song-Div">
                <TimeContextProvider>
                    {visuals ?
                        <Canvas/>
                    :
                        <><img className="Visual-Img" src={image} style={{ height: "512px", width: "512px" }} />
                        <text>{name}</text></>
                    }
                    <Player songQueue={queue} accessToken={token}/>
                </TimeContextProvider>
            </div>
    </div>
    );
}

export default SongPage;