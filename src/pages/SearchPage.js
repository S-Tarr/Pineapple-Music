import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import SearchBar from '../components/SearchBar'
import { Button } from "@mui/material";
import app from '../firebase';
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, where, doc, addDoc, updateDoc, query, orderBy, limit, getDocs, setDoc, onSnapshot, Timestamp } from "firebase/firestore";



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

const getParamsFromSpotifyAuth = (hash) => {
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  return params;
};

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const handleSpotifyLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };


async function handleSubmitToken(access_token) {
  const docSnap = await getDocs(collection(db, "users"));
  console.log(auth.currentUser.uid)
  docSnap.forEach((data) => {
    if (data.data().uid === auth.currentUser.uid) {
      updateDoc(doc(db, "users", data.id), {
        SpotifyToken: access_token
      });
    }
  });
  console.log(`submitted token` + access_token)
}

var request = require('request'); // "Request" library

var client_id = '0fbe30c6e814404e8324aa3838a7f322'; // Your client id
var client_secret = 'e414b612d1ff45dd9ba6643e3161bdff'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
    });
  }
});
  
function SearchPage() {
    const [authorized, setAuthorized] = useState(true);
    const [token, setToken] = useState({})
    useEffect(() => {
        if (window.location.hash) {
        setToken(getParamsFromSpotifyAuth(window.location.hash).access_token);
        console.log(token);
        handleSubmitToken(token);
        setAuthorized(false);
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
