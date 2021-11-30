import React, { useState } from "react";
import "./Components.css";
import song from "./testSong.wav";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';

function Player() {
    const [audio] = useState(new Audio(song));
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
            <button className="forward-rewind"><FastRewindRoundedIcon style={{ fontSize: 50 }}/></button>
            <button className="playPauseButton" onClick={() => playPause()}>
                {isPlaying ? <PauseRoundedIcon style={{ fontSize: 50 }}/> : <PlayArrowRoundedIcon style={{ fontSize: 50 }}/>}
            </button>
            <button className="forward-rewind"><FastForwardRoundedIcon style={{ fontSize: 50 }}/></button>
        </div>
    );
}

export default Player;