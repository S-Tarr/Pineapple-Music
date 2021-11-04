import { useLocation } from "react-router-dom"
import React, { useState } from 'react';
import Player from '../components/SpotifyPlayer';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import Canvas from "../components/Canvas"
import Button from "@mui/material/Button"
import "./Pages.css"

const SongPage = props => {
    const [visuals, setVisuals] = useState(false);
    const [text, setText] = useState("Visuals")
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
    
    return (
    <div className="Page">
        <Button variant="text"
        onClick={() => {toggleVisuals(); toggleText()}}>
            {text}
        </Button>
            <div className="Song-Div">
                {visuals ?
                    <Canvas/>
                :
                    <><img className="Visual-Img" src={image} style={{ height: "512px", width: "512px" }} />
                    <text>{name}</text></>
                }
                <Player/>
            </div>
    </div>
    );
}

export default SongPage;