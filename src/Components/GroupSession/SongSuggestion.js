import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Paper,
  Typography,
} from "@mui/material/";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import app from "../../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import albumCover from "../../assets/groupSessionAlbumCover.jpg";

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: "0fbe30c6e814404e8324aa3838a7f322",
  clientSecret: "e414b612d1ff45dd9ba6643e3161bdff",
  redirectUri: "localhost:3000/Pineapple-Music",
});

const db = getFirestore(app); // Firestore database

function GetRecommendation(sessionId) {
  const [songs, setSongs] = useState([]);
  const [recommendation, setRecommendation] = useState();

  useEffect(() => {
    const groupSessionQueueRef = collection(db, "groupSessionQueue");
    const groupSessionQueueQuery = query(
      groupSessionQueueRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSessionQueueQuery, (querySnapshot) => {
      let songs = [];
      querySnapshot.forEach((doc) => {
        songs = doc.data().songs;
      });
      setSongs(songs);
      let songUris = songs.map((track) =>
        track.uri.substring(track.uri.lastIndexOf(":") + 1)
      );

      spotifyApi.setAccessToken(
        "BQDSfOFyQ6ZCM4j2lF3fV2V46JAWjTswRj8q78kvzt3OFPJsBz_W2y94wYmIyYWK5VA8Exc2-ic7BKJ3Bf-TQl0RFhQtzCRqOXrt_NYfm-7aklvRG4vkEn0nekqYhr4wnkgVbxgtlr_OkAyBthnMigXOPeOCguju4kjRFNFkmFo8-L7aO7ncSQihqpzsUbBvNsmHw_WV9s-zzQgggVDLo-6RE5vpEYNS56VvXXzBWQg_jYTcYBGEKyopMU6sYtbzPeKPHdZ_jMNDzwTOZknaK-4zqN7ehYzAjrjURZacxsLnJw"
      );
      //change this access token later currently just for testing

      console.log(songUris);
      spotifyApi
        .getRecommendations({
          limit: 1,
          seed_tracks: songUris.slice(0, 5),
        })
        .then(
          function (data) {
            let recommendation = data.body;
            setRecommendation(recommendation.tracks[0]);
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
    });

    return () => unsubscribe;
  }, []);

  return recommendation;
}

function SongSuggestion({ sessionId }) {
  let recommendation = GetRecommendation(sessionId);
  console.log(recommendation);

  return (
    <Card
      elevation={5}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Paper
        align="center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <CardHeader color="primary" title="Next Song Suggestion" />
        <CardMedia
          align="center"
          component="img"
          sx={{ width: 365 }}
          image={
            recommendation === undefined
              ? albumCover
              : recommendation.album.images[0].url
          }
          alt="album cover"
        />
        <CardContent>
          <Typography>
            {recommendation === undefined
              ? "Suggestion is based on the songs in the queue. Queue up a song to see your suggestion."
              : recommendation.album.name}
          </Typography>
          <br />
          <Stack
            spacing={4}
            justifyContent="center"
            divider={
              <Divider
                color="dark"
                variant="middle"
                orientation="vertical"
                flexItem
              />
            }
            direction="row"
          >
            <Button variant="text" endIcon={<ThumbUpIcon />}>
              &nbsp;&nbsp;Upvote&nbsp;
            </Button>
            <Button variant="text" endIcon={<ThumbDownIcon />}>
              Downvote
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    </Card>
  );
}

export default SongSuggestion;
