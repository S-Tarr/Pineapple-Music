import { useLocation } from "react-router-dom"
import React from 'react';
import Player from '../components/Player';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import "./Pages.css"

const SongPage = props => {
    const track = useLocation();
    var image = Pineapple;
    var name = 'example name';
    if (track.state) {
        image = track.state.picture;
        name = track.state.name;
    }
    
    return (
    <div className="Page">
        <div className="Song-Div">
            <img className="Visual-Img" src={image} style={{ height: "512px", width: "512px" }} />
            <text>{name}</text>
            <Player/>
        </div>
    </div>
    );
}

export default SongPage;