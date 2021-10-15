/**
 * Defines the Signup React component for the signup page.
 */

import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";

const CLIENT_ID = "b85b37966e894d9cb8eb8d776047f000";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/signup"; //TODO CHANGE LATER
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

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { addSpotifyToken, signup, currentUser } = useAuth();
  const [error, setError] = useState(""); // Error represents the current message we want displayed, no error message by default
  const [loading, setLoading] = useState(false); // Loading represents the current state of the button, enabled by default
  const history = useHistory();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const params = getParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();
      localStorage.setItem("spotifyToken", params.access_token);

      console.log("getting token", params);
      addSpotifyToken("uid it is", params.access_token);
      console.log("got the access token: ");
    }
  });

  function goToHome() {
    history.push("/Pineapple-Music");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Run our validation checks
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(emailRef.current.value).toLowerCase())) {
      return setError("Email not valid");
    }

    try {
      setError("");
      setLoading(true); // disable the signup button

      const userCredentials = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );

      window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;

      //history.push("/"); // redirect user to main page
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <Container
      align="center"
      className="d-flex align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <CardContent>
            <h2 className="text-center mt-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <TextField
              required
              id="email"
              name="email"
              type="email"
              label="Email"
              variant="filled"
              inputRef={emailRef}
              fullWidth
            />
            <TextField
              required
              id="password"
              name="password"
              type="password"
              label="Password"
              variant="filled"
              inputRef={passwordRef}
              fullWidth
            />
            <TextField
              required
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="ConfirmPassword"
              variant="filled"
              inputRef={passwordConfirmRef}
              fullWidth
            />
            <Button
              disabled={loading}
              className="w-100"
              type="submit"
              onClick={handleSubmit}
            >
              Login to Spotify and Sign Up
            </Button>
            <Button onClick={goToHome}>Go To Home</Button>
          </CardContent>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
}

export default Signup;
