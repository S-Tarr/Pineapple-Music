import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import SearchBar from './Components/SearchBar'
import { Button } from "@mui/material";


const CLIENT_ID = "477666821b8941c4bd163b4ff55ed9af";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/Pineapple-Music"; //CHANGE LATER
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getParamsFromSpotifyAuth = (hash) => {
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  return params;
};

const handleSpotifyLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };


function SearchPage() {
    const [authorized, setAuthorized] = useState(true);
    const [token, setToken] = useState({})
    //var token = "BQDnY8nUbaBXf7Bg33X4AlCBvWLCkuUQzBEWwXaFNavv3T-X9mUwOisu2P_m9-giAap-UdStSZnzSNd1mFDtZpsm3wigaAoVXG1F0D7NvaaB1jJluVfWiGB2WUzxFu3eSTrlDZQM0QbsNAchLFwUmKd8AQX_WcH7DkzKB8vYr7k";
    useEffect(() => {
        if (window.location.hash) {
        setToken(getParamsFromSpotifyAuth(window.location.hash).access_token);
        console.log(token);
        setAuthorized(false);
        //TODO: CONNECT TO FIREBASE TO STORE AUTH PARAMS FROM SPOTIFY
        }
    }, [authorized]);
    return (
        <div className="SearchPage">
            <SearchBar placeholder="Enter a song name..." spotifyData={token} authorized={authorized} />
            <br />
          <br />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSpotifyLogin}
          >
            Login to Spotify
          </Button>
          <br />
          <br />
        </div>
        
    )
}

export default SearchPage
