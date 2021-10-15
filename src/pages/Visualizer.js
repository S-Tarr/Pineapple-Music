import './Pages.css';
import React from 'react';
import logo from '../assets/pineapple-supply-co-KvbCXEllJss-unsplash.jpg'
import {
    useState
} from "react";

function Visualizer() {
    const [mode, setMode] = useState("App-Logo");
    return(
        <div className="Page">
            <div className="Visual-Div">
                <button className="Visual-Button" onClick={() => setMode("App-Logo")}>Type 1</button>
                <button className="Visual-Button" onClick={() => setMode("Song-Img")}>Type 2</button>
                <button className="Visual-Button" onClick={() => setMode("Visual-Flip")}>Type 3</button>
            </div>
            <div className="Visual-Img">
                <img src={logo} className={mode} height={200} width={250}/>
            </div>
        </div>
    )
}

export default Visualizer;