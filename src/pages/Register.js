import React, { useState, useEffect } from "react";

import {
  Button,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

//https://accounts.spotify.com/authorize?client_id=5fe01282e94241328a84e7c5cc169164&redirect_uri=http:%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&response_type=token&state=123
const CLIENT_ID = "b85b37966e894d9cb8eb8d776047f000";
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

function Register() {
  const [authorized, setAuthorized] = useState(true);
  console.log(authorized);
  useEffect(() => {
    if (window.location.hash) {
      getParamsFromSpotifyAuth(window.location.hash);
      setAuthorized(false);
      //TODO: CONNECT TO FIREBASE TO STORE AUTH PARAMS FROM SPOTIFY
    }
  }, [authorized]);

  const AppIcon =
    "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg";

  const handleSpotifyLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  return (
    <Grid container>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt="pineapple" style={{ alignSelf: "center" }} />
        <Typography variant="h3">Register</Typography>
        <form noValidate>
          <TextField
            id="username"
            name="username"
            type="username"
            label="Username"
            fullWidth
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            fullWidth
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="confirmPassword"
            label="ConfirmPassword"
            fullWidth
          />
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
          <Button type="submit" variant="contained" color="primary"
          disabled={authorized}>
            Register
          </Button>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

export default Register;
