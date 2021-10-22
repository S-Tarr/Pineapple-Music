import React, { useState } from "react";
import "./Components.css";
import song from "./testSong.wav"

function Player() {
    const [audio, setAudio] = useState(new Audio(song));
    const [isPlaying, setState] = useState(false);

    const playPause = () => {
        if (isPlaying) {
            audio.pause();
            setState(false);
        }
        else {
            audio.play();
            setState(true);
        }
    };

    return(
        <div className="Player-Div">
            <button className="Player">Skip</button>
            <button className="Player" onClick={() => playPause()}>Play/Pause</button>
            <button className="Player">Rewind</button>
        </div>
    );
}

export default Player;