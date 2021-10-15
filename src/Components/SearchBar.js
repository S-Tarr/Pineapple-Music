import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Track from './Track'
var SpotifyWebApi = require('spotify-web-api-node');


var spotifyApi = new SpotifyWebApi({
    clientId : '477666821b8941c4bd163b4ff55ed9af',
    clientSecret: '5a9f7c25c73a46ca958cf138c64f1297',
    redirectUri: 'localhost:3000/Pineapple-Music'
});

function SearchBar({ placeholder, spotifyData, authorized }) {
  console.log(spotifyData);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [searchResults, setSearchResults] = useState([])
  const access_token = 'BQBdR3UjvW8zYpbrOLSPd9taFSv8uHdHavHpJZ6StDPg1pSlR0sdFGbsPTm38V1XUMcxnUWtOfqe5Bbmuc5fqf6DUpM4pWUqfe3voZGR3qnAQAKHG35hFV-tPLsSVyj-3iUxsxM3P0cleWUBr9tvMRkzXVWPticEau1mmdi1GG5FG_mFECzYgDx979ZCvYQ6ZFkxNodiekzV_1mx1EeBh2LEibLgeVEjab3L0MxW4UcChb_BzGcdUtANrBO1yWBR9x_QVgZF4KVathktiqzFn802hFj7URPWjcQQ6p4o4ovvflPL2r6x';
  useEffect(() => {
    if (!access_token) return
    spotifyApi.setAccessToken(access_token)
  }, [access_token])

  useEffect(() => {
    if (!wordEntered) return setSearchResults([])
    spotifyApi.searchTracks(wordEntered).then(res => {
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
                />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;