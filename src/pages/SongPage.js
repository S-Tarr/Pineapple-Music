import { useLocation } from "react-router-dom"
import React from 'react';
import Player from '../components/SpotifyPlayer';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import "./Pages.css"

const SongPage = props => {
    const track = useLocation();
    var image = Pineapple;
    var name = 'example name';
    var uri = null;
    if (track.state) {
        image = track.state.picture;
        name = track.state.name;
        uri = track.state.trackUri;
    }
    
    return (
    <div className="Page">
        <div className="Song-Div">
            <img className="Visual-Img" src={image} style={{ height: "512px", width: "512px" }} />
            <text>{name}</text>
            <Player accessToken={track.state.access_token} trackUri={track.state.trackUri} />
        </div>
    </div>
    );
}

export default SongPage;