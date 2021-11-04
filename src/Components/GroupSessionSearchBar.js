import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Track from './Track';
import app from "../firebase";
import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    getDocs,
    setDoc,
    addDoc,
    Timestamp,
  } from "firebase/firestore";
  
const db = getFirestore(app);


var SpotifyWebApi = require('spotify-web-api-node');



var spotifyApi = new SpotifyWebApi({
    clientId : '0fbe30c6e814404e8324aa3838a7f322',
    clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
    redirectUri: 'localhost:3000/Pineapple-Music'
});

let groupSessionQueueDoc;
let groupSessionQueueId;

function GroupSessionSearchBar({ placeholder, spotifyData, authorized, groupSessionQueueDoc, groupSessionQueueId }) {

  const history = useHistory()

  groupSessionQueueDoc = groupSessionQueueDoc;
  groupSessionQueueId = groupSessionQueueId;

  console.log(spotifyData);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [searchResults, setSearchResults] = useState([])
  const access_token = spotifyData;
  useEffect(() => {
    if (!access_token) return
    spotifyApi.setAccessToken(access_token)
  }, [access_token])

  useEffect(() => {
    if (!wordEntered) return setSearchResults([])
    spotifyApi.searchTracks(wordEntered).then(res => {
        console.log(res.body.tracks.items);
        setSearchResults(
            res.body.tracks.items.map(track => {
              const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                track.album.images[0]
              )
    
              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
              }
            })
        )
    });
  }, [wordEntered, access_token])

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  async function handleSubmitTrack(track) {
    await addDoc(collection(db, 'groupSessionQueue', groupSessionQueueId, 'queue'), {
        songUri: track.uri,
        songName: track.title,
        addedAt: Timestamp.fromDate(new Date())
    });
  }

  async function handleRedirect(track) {
    console.log(track);

    handleSubmitTrack(track);

    const docRef = await setDoc(doc(db, "groupSessionQueue", groupSessionQueueId), {
        createdAt: groupSessionQueueDoc.createdAt, sessionId: groupSessionQueueDoc.sessionId, queueId: groupSessionQueueDoc.queueId, songs: [...groupSessionQueueDoc.songs, track]
    });
    window.location.reload(false);
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
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
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
                    name={track.title}
                    picture={track.albumUrl}
                />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupSessionSearchBar;