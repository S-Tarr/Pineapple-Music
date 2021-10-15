import { Link, useHistory } from "react-router-dom"
import React from 'react';
import Player from '../components/Player';
import "./Pages.css"

const Visualizer = () => {
    return (
    <div className="Page">Hello
        <header>Visualizer Page</header>
        <Player/>
    </div>
    );
}

export default Visualizer;