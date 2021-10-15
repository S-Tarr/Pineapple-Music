import { useLocation } from "react-router-dom"
import React from 'react';
import Player from '../components/Player';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import "./Pages.css"

const SongPage = props => {
    const track = useLocation();
    
    return (
    <div className="Page">
        <img className="Visual-Img" src={track.state.picture} style={{ height: "512px", width: "512px" }} />
        <text>{track.state.name}</text>
        <Player/>
    </div>
    );
}

export default SongPage;