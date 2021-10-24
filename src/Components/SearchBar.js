import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Track from './Track'
import Player from './SpotifyPlayer'
var SpotifyWebApi = require('spotify-web-api-node');




var spotifyApi = new SpotifyWebApi({
    clientId : '0fbe30c6e814404e8324aa3838a7f322',
    clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
    redirectUri: 'localhost:3000/Pineapple-Music'
});

function SearchBar({ placeholder, spotifyData, authorized }) {

  const history = useHistory()

  console.log(spotifyData);
  const [wordEntered, setWordEntered] = useState("");
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState();
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
              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: track.album.images[0].url,
              }
            })
        )
    });
  }, [wordEntered, access_token])

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
  };

  function handleRedirect(track) {
      console.log(track);

      history.push({
          pathname: '/song',
          state: {name: track.title, picture: track.albumUrl, trackUri: track.uri, access_token: access_token}
      });
      //setPlayingTrack(track);
  }
  const playSong = (id) => {
    spotifyApi
      .play({
        uris: [`spotify:track:${id}`],
      })
      /*.then((res) => {
        spotifyApi
        .getMyCurrentPlayingTrack().then((r) => {
          dispatch({
            type: "SET_ITEM",
            item: r.item,
          });
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        });
      });*/
  };

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