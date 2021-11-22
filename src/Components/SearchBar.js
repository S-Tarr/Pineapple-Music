import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Track from './Track'
import queueConverter from './Queue';
import app from '../firebase';
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, where, doc, addDoc, updateDoc, getDoc, query, orderBy, limit, getDocs, setDoc, onSnapshot, Timestamp } from "firebase/firestore";
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId : '0fbe30c6e814404e8324aa3838a7f322',
    clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
    redirectUri: 'localhost:3000/Pineapple-Music'
});

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

async function getCurrentSession() {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}
async function GetSessionUID(groupID) {
  //const [sessionID, setSessionID] = useState();
  const q = query(collection(db, 'groupSessions'), where('sessionId', '==',  groupID));
  const docSnap = await getDocs(q);
  docSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    return doc.id;
  });
}

var userDocId = null;

async function getAccessToken() {
  const docSnap = await getDocs(collection(db, "users"));
  console.log(auth.currentUser.uid)
  let temp = null;
  docSnap.forEach((thing) => {
    console.log(thing.data().uid)
    if (thing.data().uid == auth.currentUser.uid) {
      temp = thing.data();
      userDocId = thing.uid;
      console.log(temp)
    }
  });
  console.log(temp)
  return temp;
}


function SearchBar({ placeholder, spotifyData }) {

  const [curSession, setCurSession] = useState();
  const [curSessionID, setCurSessionID] = useState();

  //-------Token Handling------------
  const [isLoaded, setIsLoaded] = useState(true);
  const [access_token, setAccessToken] = useState("");
  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      setAccessToken(ret.SpotifyToken);
      console.log(ret.SpotifyToken)
      console.log(access_token)
      spotifyApi.setAccessToken(ret.SpotifyToken);
    });
    console.log(access_token);
  }, [isLoaded])

  console.log(access_token)

  if (access_token == undefined) {
    setIsLoaded(false)
  }
  console.log(isLoaded)
//--------End Token Handling-----------------


  useEffect(() => {
    const promise = getCurrentSession();
    promise.then((ret) => setCurSession(ret));
    console.log(curSession);
  }, [])
  
  const currentUser = auth.currentUser;
  console.log(currentUser.uid);
  
  const history = useHistory();

  console.log(spotifyData);
  const [wordEntered, setWordEntered] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  
  /*useEffect(() => {
    if (!access_token) return
    spotifyApi.setAccessToken(access_token);
    console.log(access_token)
    handleSubmitToken();
  }, [access_token])*/



  useEffect(() => {
    if (!wordEntered) return setSearchResults([])
    spotifyApi.searchTracks(wordEntered).then(res => {
        console.log(res.body.tracks.items);
        setSearchResults(
            res.body.tracks.items.map(track => {
              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: track.album.images[0].url,
              }
            })
        )
    });
  }, [wordEntered])

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
  };

  async function handleSubmitTrack(track) {
    await addDoc(collection(db, 'userQueue', currentUser.uid, 'queue'), {
        songUri: track.uri,
        songName: track.title,
        addedAt: Timestamp.fromDate(new Date())
    });
  }

  async function handleSubmitGroupTrack(track) {
    await addDoc(collection(db, 'groupSessions', curSessionID, 'queue'), {
        songUri: track.uri,
        songName: track.title,
        addedAt: Timestamp.fromDate(new Date())
    });
  }

  async function handleSubmitToken() {
    const userRef = collection(db, 'users');
    await updateDoc(doc(userRef, userDocId), {
        SpotifyToken: access_token,
    });
  }

  function handleRedirect(track) {
      console.log(track);
      setPlayingTrack(track);
      handleSubmitTrack(track);
      history.push({
          pathname: '/song',
          state: {name: track.title, picture: track.albumUrl, trackUri: track.uri, access_token: access_token}
      });
  }

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          
        </div>
      </div>
      
      {searchResults.length != 0 && (
        <div className="dataResult">
          {searchResults.slice(0, 10).map((track) => {
            return (
                <Track
                    track={track}
                    key={track.uri}
                    chooseTrack={handleRedirect}
                />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;