import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  LinearProgress,
  Slide,
  Snackbar,
  SnackbarContent,
  Stack,
  Paper,
  Typography,
} from "@mui/material/";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import app from "../../firebase";
import {
  getFirestore,
  getDocs,
  collection,
  deleteField,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import albumCover from "../../assets/groupSessionAlbumCover.jpg";

const auth = getAuth(); // Authorization component

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: "0fbe30c6e814404e8324aa3838a7f322",
  clientSecret: "e414b612d1ff45dd9ba6643e3161bdff",
  redirectUri: "localhost:3000/Pineapple-Music",
});

const db = getFirestore(app); // Firestore database

function GetVoteStatus(
  sessionId,
  setVoted,
  setUpvoteCount,
  setTotalVoteCount,
  setTotalUsersInSession,
  setRecommendation
) {
  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSessionQuery, (querySnapshot) => {
      let currentSuggestion = null;
      querySnapshot.forEach((currDoc) => {
        //Check if the current user voted or not
        currentSuggestion = currDoc.data().currentSuggestion;
        setRecommendation(currentSuggestion);

        //Update total active user count
        const size = Object.values(currDoc.data().users).filter(
          (state) => state === "active"
        ).length;
        setTotalUsersInSession(size);

        let voteSet = new Set();
        if (
          currDoc.data().votes != null &&
          currDoc.data().votes !== "undefined" &&
          currDoc.data().votes !== null &&
          currDoc.data().votes != undefined
        ) {
          voteSet = new Set(Object.keys(currDoc.data().votes));

          //Update upvoteCount and totalVoteCount
          const upvoteCountTemp = Object.values(currDoc.data().votes).reduce(
            (a, v) => (v === "upvote" ? a + 1 : a),
            0
          );
          const totalVoteCountTemp = voteSet.size;

          setTotalVoteCount(totalVoteCountTemp);
          setUpvoteCount(upvoteCountTemp);
        } else {
          setTotalVoteCount(0);
          setUpvoteCount(0);
          setVoted(false);
        }

        if (voteSet.has(auth.currentUser.uid)) {
          setVoted(true);
        } else {
          setVoted(false);
        }
      });
    });
    return () => unsubscribe;
  }, []);

  return sessionId;
}

function VotingResult({
  votes,
  totalUsersInSession,
  addedSongState,
  handleAddedSongClose,
}) {
  const percentage = (votes / totalUsersInSession) * 100;

  const addedMessage =
    "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "Added song to the queue";
  const skippedMessage =
    "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "Skipped song";

  return (
    <>
      <Box sx={{ width: "100%", mr: 1 }}>
        <Typography>Current Voting Result</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={percentage} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${votes}/${totalUsersInSession}`}</Typography>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={addedSongState.open}
        autoHideDuration={3000}
        onClose={handleAddedSongClose}
        TransitionComponent={Slide}
      >
        <SnackbarContent
          style={{
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
          }}
          message={addedSongState.added ? addedMessage : skippedMessage}
        />
      </Snackbar>
    </>
  );
}

function SongSuggestion({ sessionId }) {
  const [voted, setVoted] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [totalUsersInSession, setTotalUsersInSession] = useState(0);
  const [recommendation, setRecommendation] = useState();

  const [addedSongState, setAddedSongState] = useState({
    open: false,
    added: false,
  });

  const handleAddedSongClose = () => {
    setAddedSongState({
      ...addedSongState,
      open: false,
    });
  };

  GetVoteStatus(
    sessionId,
    setVoted,
    setUpvoteCount,
    setTotalVoteCount,
    setTotalUsersInSession,
    setRecommendation
  );

  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    getDocs(groupSessionQuery).then((groupSessionQuerySnapshot) => {
      let currentSuggestion = null;
      groupSessionQuerySnapshot.forEach((currDoc) => {
        console.log(
          "voted",
          voted,
          "totalVoteCount",
          totalVoteCount,
          "totalUsersInSession",
          totalUsersInSession,
          "upvoteCount",
          upvoteCount
        );
        try {
          //Check if song suggestion already exists
          currentSuggestion = currDoc.data().currentSuggestion;
          console.log(
            "percentage rn:",
            ((upvoteCount * 1.0) / totalUsersInSession) * 100
          );
          if (
            currentSuggestion == null ||
            currentSuggestion === undefined ||
            currentSuggestion == "undefined" ||
            (totalVoteCount !== 0 && totalVoteCount === totalUsersInSession) ||
            (totalVoteCount !== 0 &&
              ((upvoteCount * 1.0) / totalUsersInSession) * 100 > 50)
          ) {
            //Song suggestion does not already exist (First song recommendation)
            // or upvote percentage greater than 50%
            // or every active user in the session has voted
            // therefore, get a new song to recommend

            console.log(
              "currentSuggestion is undefined or voting is over",
              currentSuggestion
            );

            //Refresh the votes value for the new song suggestion
            const sessionRef = doc(db, "groupSessions", currDoc.id);
            updateDoc(sessionRef, {
              votes: deleteField(),
            });

            //Reset voted to false if voting has ended
            if (
              totalVoteCount === totalUsersInSession ||
              ((upvoteCount * 1.0) / totalUsersInSession) * 100 > 50
            ) {
              setVoted(false);
            }

            //TODO:Add the recommended song to the queue if upvote percentage is greater than 50%
            if (((upvoteCount * 1.0) / totalUsersInSession) * 100 > 50) {
              console.log(
                "upvote greater than 50%",
                ((upvoteCount * 1.0) / totalUsersInSession) * 100
              );
              setAddedSongState({
                open: true,
                added: true,
              });
              console.log(currentSuggestion);
            } else if (totalVoteCount === totalUsersInSession) {
              setAddedSongState({
                open: true,
                added: false,
              });
            }

            //Get recommendation song using Spotify API by fetching current songs
            const groupSessionQueueRef = collection(db, "groupSessionQueue");
            const groupSessionQueueQuery = query(
              groupSessionQueueRef,
              where("sessionId", "==", sessionId)
            );
            getDocs(groupSessionQueueQuery).then(
              (groupSessionQueueQuerySnapshot) => {
                let songs = [];
                groupSessionQueueQuerySnapshot.forEach((doc) => {
                  songs = doc.data().songs;
                });
                let songUris = songs.map((track) =>
                  track.uri.substring(track.uri.lastIndexOf(":") + 1)
                );

                spotifyApi.setAccessToken(
                  "BQAu2_-VdA9cjWdAimlPVbycBLW6WXV6BawviGoX3irjSJ8caOFJlbtSYhScDH7a0Q6Vb55xtKs3jNb0CeOLUH7XRVzPa7Bm9O5RgT0Gf7wslefVlz4rTzL8pdAgoAVS8KQb-ZkT_t9L7YGtuNhdov971PU091bWUkhNZoLlWAyvr3k7trDQixNaQc8EJDH0pWYzpqmqpJBimPnKY32wm4mYP4bFei5AiN3TfWsRqRxfqrZ2QdzbtbXLmjwgsVW1Nu_pfOwzqfuyAUKnvd-IaeMGGiJXCR5-khVtE2xnhq7N4w"
                );
                //TODO: change this access token later. currently just for testing

                spotifyApi
                  .getRecommendations({
                    limit: 1,
                    seed_tracks: songUris.slice(0, 5),
                  })
                  .then(
                    function (data) {
                      const trackData = data.body.tracks[0];
                      const docData = {
                        albumUrl: trackData.album.images[0].url,
                        artist: trackData.album.artists[0].name,
                        title: trackData.album.name,
                        uri: trackData.album.uri,
                      };

                      const sessionRef = doc(db, "groupSessions", currDoc.id);
                      updateDoc(sessionRef, {
                        currentSuggestion: docData,
                      });
                      setRecommendation(docData);
                    },
                    function (err) {
                      console.log("Something went wrong!", err);
                    }
                  );
              }
            );
          } else {
            console.log("currentSuggestion is not undefined");
            setRecommendation(currentSuggestion);
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  }, [totalVoteCount, upvoteCount]);

  const handleVote = (event) => {
    event.preventDefault();
    setVoted(true);
    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    getDocs(groupSessionQuery).then((groupSessionQuerySnapshot) => {
      groupSessionQuerySnapshot.forEach((currDoc) => {
        const sessionRef = doc(db, "groupSessions", currDoc.id);
        updateDoc(sessionRef, {
          [`votes.${auth.currentUser.uid}`]: `${event.target.name}`,
        });
      });
    });
  };

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
          sx={{ width: 285 }}
          image={
            recommendation == null ||
            recommendation === undefined ||
            recommendation == "undefined"
              ? albumCover
              : recommendation.albumUrl
          }
          alt="album cover"
        />
        <CardContent>
          <Typography variant="h6">
            {recommendation == null ||
            recommendation === undefined ||
            recommendation == "undefined"
              ? "Suggestion is based on the songs in the queue. Queue up a song to see your suggestion."
              : recommendation.title}
          </Typography>
          <br />
          <Divider />
          <br />
          <Stack
            spacing={4}
            justifyContent="center"
            divider={
              <Divider variant="middle" orientation="vertical" flexItem />
            }
            direction="row"
          >
            <Button
              variant="text"
              disabled={
                voted ||
                recommendation == null ||
                recommendation === undefined ||
                recommendation == "undefined"
              }
              endIcon={<ThumbUpIcon />}
              name="upvote"
              onClick={handleVote}
            >
              &nbsp;&nbsp;Upvote&nbsp;
            </Button>
            <Button
              variant="text"
              disabled={
                voted ||
                recommendation == null ||
                recommendation === undefined ||
                recommendation == "undefined"
              }
              endIcon={<ThumbDownIcon />}
              name="downvote"
              onClick={handleVote}
            >
              Downvote
            </Button>
          </Stack>
          <br />
          <Divider />
          <br />
          <VotingResult
            votes={upvoteCount}
            totalUsersInSession={totalUsersInSession}
            addedSongState={addedSongState}
            handleAddedSongClose={handleAddedSongClose}
          />
        </CardContent>
      </Paper>
    </Card>
  );
}

export default SongSuggestion;
