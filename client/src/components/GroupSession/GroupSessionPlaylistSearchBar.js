import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import "../SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Playlist from '../Playlist';
import app from "../../firebase";
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

function GroupSessionPlaylistSearch({ placeholder, spotifyData, authorized, groupSessionQueueDoc, groupSessionQueueId }) {

  const history = useHistory()

  groupSessionQueueDoc = groupSessionQueueDoc;
  groupSessionQueueId = groupSessionQueueId;

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const access_token = spotifyData;
  useEffect(() => {
    if (!access_token) return
    spotifyApi.setAccessToken(access_token)
  }, [access_token])

  useEffect(() => {
    if (!wordEntered) return setSearchResults([])
    spotifyApi.searchPlaylists(wordEntered).then(res => {
        setSearchResults(
            res.body.playlists.items.map(playlist => {
              const smallestPlaylistImage = playlist.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                playlist.images[0]
              )

              return {
                artist: playlist.owner.display_name,
                title: playlist.name,
                uri: playlist.uri,
                tracks: "temp",
                id: playlist.id,
                albumUrl: smallestPlaylistImage.url,
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

  async function handleSubmitTrack(playlist) {
    await addDoc(collection(db, 'groupSessionQueue', groupSessionQueueId, 'queue'), {
        playlistUri: playlist.uri,
        playlistName: playlist.title,
        addedAt: Timestamp.fromDate(new Date())
    });
  }

  async function handleRedirect(playlist) {
    //figure out how to handle below stuff
    //have to use a state set function to get the values correctly

    handleSubmitTrack(playlist);

    const docRef = await setDoc(doc(db, "groupSessionQueue", groupSessionQueueId), {
        createdAt: groupSessionQueueDoc.createdAt, sessionId: groupSessionQueueDoc.sessionId, queueId: groupSessionQueueDoc.queueId, songs: [...groupSessionQueueDoc.songs, playlist]
    });

    spotifyApi.getPlaylistTracks(playlist.id).then(res => {
      let items = res.body.items;
  
      const groupSessionRef = collection(db, "groupSessionQueue");
      const groupSession = query(
          groupSessionRef,
          where("sessionId", "==", groupSessionQueueDoc.sessionId)
      );
      let item;
      getDocs(groupSession).then((querySnapshot) => {
        querySnapshot.forEach((newdoc) => {
          let length = newdoc.data().songs.length;
          let item = newdoc.data().songs[length-1];
          item.tracks = items;
          setDoc(doc(db, "groupSessionQueue", groupSessionQueueId), {
              createdAt: groupSessionQueueDoc.createdAt, sessionId: groupSessionQueueDoc.sessionId, queueId: groupSessionQueueDoc.queueId, songs: [...groupSessionQueueDoc.songs, item]
          });
        });
      })
    })
    //window.location.reload(false);
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
          {searchResults.slice(0, 10).map((playlist) => {
            return (
                <Playlist
                    playlist={playlist}
                    key={playlist.uri}
                    choosePlaylist={handleRedirect}
                />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupSessionPlaylistSearch;