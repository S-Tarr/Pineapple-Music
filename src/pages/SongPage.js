import { Link, useHistory } from "react-router-dom"
import React from 'react';
import Player from '../components/Player';
import Pineapple from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import "./Pages.css"

const SongPage = () => {
    return (
    <div className="Page">
        <div className="Song-Div">
            <img className="Song-Img" src={Pineapple} height={200} width={250} />
            <text>Song Name Here</text>
            <Player/>
        </div>
    </div>
    );
}

export default SongPage;