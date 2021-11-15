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
        "BQB8wJaYTq9wo2O-q42cArYft3FkML8sKW9XipTb8JJ-5FAzqMLcEml3POIDku68hAbBD0u2RsmsjN6V5CSjwDJyVJ03S9_lemyviRzqP__wMkKchfV2c0_FeUNiMHkDaXtjoyqypxteeqRGRLhIK9qASM_nplKpKoUzWumprKvrNcsHNKvSomahMNtYvutlkuk6mqWwEzcEwIYsa4rQbHYVUaq_IGa6gurgespvXiccU42FxjnbR6ODwLfbWkNk0wUBd64G4VvEcQ3dWjUqqMW9-bRmTXl36Q4Ah_ZVkDT0og"
      );
      //TODO: change this access token later currently just for testing

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
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Paper
        align="center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
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
            <Button
              variant="text"
              disabled={recommendation === undefined}
              endIcon={<ThumbUpIcon />}
            >
              &nbsp;&nbsp;Upvote&nbsp;
            </Button>
            <Button
              variant="text"
              disabled={recommendation === undefined}
              endIcon={<ThumbDownIcon />}
            >
              Downvote
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    </Card>
  );
}

export default SongSuggestion;
