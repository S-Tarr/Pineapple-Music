import { useLocation } from "react-router-dom"
import React, { useState } from 'react';
import Player from '../components/SpotifyPlayer';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg';
import Canvas from "../components/Canvas";
import Button from "@mui/material/Button";
import TimeContextProvider from "../contexts/TimeContext";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
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
import "./Pages.css"

const SongPage = () => {
    const [visuals, setVisuals] = useState(false);
    const [text, setText] = useState("Visuals");
    const track = useLocation();
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
    
    async function handleBookmark() {
        // await updateDoc(doc(db, "groupSessions", docId), {
        //   queueOffset: offset - 1,
        // });
    }

    return (
    <div className="Page">
        <Button variant="text"
        onClick={() => {toggleVisuals(); toggleText()}}>
            {text}
        </Button>
            <div className="Song-Div">
                <button className="bookmark-button" onClick={() => handleBookmark()}>
                    <BookmarkBorderIcon style={{ fontSize: 50 }} />
                </button>
                <TimeContextProvider>
                    {visuals ?
                        <Canvas/>
                    :
                        <><img className="Visual-Img" src={image} style={{ height: "512px", width: "512px" }} />
                        <text>{name}</text></>
                    }
                    <Player/>
                </TimeContextProvider>
            </div>
    </div>
    );
}

export default SongPage;