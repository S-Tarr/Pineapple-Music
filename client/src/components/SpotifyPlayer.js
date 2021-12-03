import React, { useState, useEffect, useContext } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import { TimeContext } from '../contexts/TimeContext';
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : '0fbe30c6e814404e8324aa3838a7f322',
  clientSecret: 'e414b612d1ff45dd9ba6643e3161bdff',
  redirectUri: 'localhost:3000/Pineapple-Music'
});

export default function Player(props) {
  const {setTime, updateTime} = useContext(TimeContext);
  spotifyApi.setAccessToken(props.accessToken);
  var play2 = true;
  var isLoaded = true;

  useEffect(()=> {
    const interval = setInterval(async () => {
      updateTime();
    }, 1);
    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!props.accessToken) return null;
  return (
    <SpotifyPlayer
      token={props.accessToken}
      uris={props.songQueue}
      play={play2}
      autoPlay={true}
      callback={state => {
        if (state.isPlaying) {
          play2 = true;
        }
        else {
          play2 = false;
        }
        if (state.track.id != undefined && state.track.id != null &&
            state.track.id != "") {
          //console.log("Track id: " + state.track.id);
          spotifyApi.getAudioAnalysisForTrack(state.track.id)
          .then(function(data) {
            setTime({timeStamp: new Date(), elapsed: state.progressMs,
            isPlaying: state.isPlaying, beats: data.body.beats, segments: data.body.segments,
            song: state.track.id});
          }, 
          function(err) {
            console.log(err);
          });
        }
      }}
    />
  )
}