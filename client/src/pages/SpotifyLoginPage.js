import React, { useState, useEffect } from "react";
import "./SearchPage.css";

const CLIENT_ID = "477666821b8941c4bd163b4ff55ed9af";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/Pineapple-Music"; //CHANGE LATER
const SCOPES = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
  
function SpotifyLoginPage() {
    return (
        <div className="SearchPage">
            <br />
          <br />
        <a href={`${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true`}>
            Login
        </a>
          <br />
          <br />
        </div>
        
    )
}

export default SpotifyLoginPage
