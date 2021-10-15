import React from "react";
import "./Components.css";

function Player() {
    return(
        <div className="Player-Div">
            <button className="Player">Rewind</button>
            <button className="Player">Play/Pause</button>
            <button className="Player">Skip</button>
        </div>
    );
}

export default Player;