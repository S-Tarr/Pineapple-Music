import React, { useEffect } from "react";
import { Button } from "@mui/material";

import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";

const CLIENT_ID = "b85b37966e894d9cb8eb8d776047f000";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/myaccount"; //TODO CHANGE LATER
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"]; //TODO CHANGE LATER IF NECESSARY
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getParamsFromSpotifyAuth = (hash) => {
  console.log("trying to get the token");
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  return params;
};

function ChangeAccount() {
  const { addSpotifyToken, currentUser } = useAuth();

  useEffect(() => {
    if (window.location.hash) {
      const params = getParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();
      localStorage.setItem("spotifyToken", params.access_token);

      addSpotifyToken("testing uid", params.access_token);
      console.log("got the access token: ");
    }
  });

  const history = useHistory();

  async function handleLogout() {
    try {
      window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    } catch {
      console.log("Failed to change account.");
    }
  }

  return (
    <Button variant="link" onClick={handleLogout}>
      Change your spotify Account
    </Button>
  );
}

export default ChangeAccount;
