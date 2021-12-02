import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Divider,
  LinearProgress,
  Slide,
  Snackbar,
  Stack,
  Paper,
  Typography,
} from "@mui/material/";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import app from "../../firebase";
import {
  arrayRemove,
  collection,
  deleteField,
  doc,
  getFirestore,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
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

const getParamsFromSpotifyAuth = (hash) => {
  console.log("trying to get the token", hash);
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  console.log(params);
  return params;
};

async function getAccessToken() {
  const docSnap = await getDocs(collection(db, "users"));
  let temp = null;
  docSnap.forEach((thing) => {
    if (thing.data().uid == auth.currentUser.uid) {
      temp = thing.data();
    }
  });
  return temp;
}

function GetVoteStatus(
  sessionId,
  setVoted,
  setUpvoteCount,
  setTotalVoteCount,
  setTotalUsersInSession,
  setRecommendation
) {

  useEffect(() => {
    if (window.location.hash) {
      const params = getParamsFromSpotifyAuth(window.location.hash);
      spotifyApi.setAccessToken(params.access_token);

      console.log("getting token", params);
    }
  }, [window.location.search]);

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
  totalVotes,
}) {
  const percentage = (votes / totalUsersInSession) * 100;

  const addedMessage =
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "Added song";
  const skippedMessage =
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "Skipped song";

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  return (
    <>
      <LightTooltip
        title={
          <React.Fragment>
            <Stack direction="row" spacing={1}>
              <Chip icon={<ThumbUpIcon />} label={votes} />
              <Chip icon={<ThumbDownIcon />} label={totalVotes - votes} />
              <Chip icon={<PeopleAltIcon />} label={totalUsersInSession} />
            </Stack>
          </React.Fragment>
        }
      >
        <div>
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
        </div>
      </LightTooltip>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={addedSongState.open}
        autoHideDuration={3000}
        onClose={handleAddedSongClose}
        TransitionComponent={Slide}
      >
        {/* <SnackbarContent
          style={{
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
          }}
          message={addedSongState.added ? addedMessage : skippedMessage}
        /> */}
        {addedSongState.added ? (
          <Alert severity="success" sx={{ width: "100%" }}>
            {addedMessage}
          </Alert>
        ) : (
          <Alert severity="error" sx={{ width: "100%" }}>
            {skippedMessage}
          </Alert>
        )}
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
    console.log("getting access token in songsuggestion", access_token);
  }, [isLoaded])

  if (access_token == null) {
    setIsLoaded(false)
  }

  useEffect(() => {
    // var promise = getAccessToken();
    // promise.then((ret) => {
    //   setAccessToken(ret.SpotifyToken);
    //   console.log(ret.SpotifyToken)
    //   console.log(access_token)
    //   spotifyApi.setAccessToken(ret.SpotifyToken);
    // });

    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    getDocs(groupSessionQuery).then((groupSessionQuerySnapshot) => {
      let currentSuggestion = null;
      groupSessionQuerySnapshot.forEach((currDoc) => {
        try {
          //Check if song suggestion already exists
          currentSuggestion = currDoc.data().currentSuggestion;
          const downVotePercentage = 100 - (((upvoteCount * 1.0) / totalUsersInSession) * 100);
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
            const groupSessionQueueRef = collection(db, "groupSessionQueue");
            const groupSessionQueueQuery = query(
              groupSessionQueueRef,
              where("sessionId", "==", sessionId)
            );

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
              getDocs(groupSessionQueueQuery).then(
                (groupSessionQueueQuerySnapshot) => {
                  groupSessionQueueQuerySnapshot.forEach((queueDoc) => {
                    updateDoc(doc(db, "groupSessionQueue", queueDoc.id), {
                      createdAt: queueDoc.data().createdAt,
                      sessionId: queueDoc.data().sessionId,
                      queueId: queueDoc.data().queueId,
                      //songs: [...queueDoc.data().songs, currentSuggestion],
                      songs: arrayRemove(currentSuggestion),
                    }).then(() => {
                      updateDoc(doc(db, "groupSessionQueue", queueDoc.id), {
                        createdAt: queueDoc.data().createdAt,
                        sessionId: queueDoc.data().sessionId,
                        queueId: queueDoc.data().queueId,
                        songs: [...queueDoc.data().songs, currentSuggestion],
                      });
                    });
                  })

                }
              );
            } else if (totalVoteCount === totalUsersInSession) {
              setAddedSongState({
                open: true,
                added: false,
              });
            }

            //Get recommendation song using Spotify API by fetching current songs
            getDocs(groupSessionQueueQuery).then(
              (groupSessionQueueQuerySnapshot) => {
                let songs = [];
                groupSessionQueueQuerySnapshot.forEach((doc) => {
                  songs = doc.data().songs;
                });
                let songUris = songs.map((track) =>
                  track.uri.substring(track.uri.lastIndexOf(":") + 1)
                );

                // spotifyApi.setAccessToken(
                //   "BQDGSWrThtpTXehH9N9VNS86P4RqJCLknPtF_SkAn5ZCSnmmApfQUDt2cO3UFI_umd0yVkz39JlSkNejBlAfePYub0AcHl50LLZa3iMmmvQiFjPw_tHl32C4cmYWu0Ma82dJOGrbTlnghvp7v4j8CXPObWpD5Etlt_I2JiZ3_a8GVjb_FMWA8gIjT2nET1HFZUQPo2ZPUSmYXzUvtWQGXdDtcGRuxUpv0KrEAfiQS3Oj9b1Yt88T6Td7t3NAmY-4Pg0nFrXrK9toVq9_LgQRGTInErh18nwoiS3lCu1rWITZhg"
                // );
                // change this access token later. currently just for testing

                if (songUris.length > 2) {
                  spotifyApi
                    .getRecommendations({
                      limit: 1,
                      seed_tracks: songUris.slice(0, 5),
                    })
                    .then(
                      function (data) {
                        console.log(data.body)
                        const trackData = data.body.tracks[0];
                        if (
                          trackData == null ||
                          trackData === "undefined" ||
                          trackData === undefined
                        ) {
                          throw new Error("queue is possibly empty");
                        }
                        const docData = {
                          albumUrl: trackData.album.images[0].url,
                          artist: trackData.album.artists[0].name,
                          title: trackData.album.name,
                          uri: trackData.uri,
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
                } else {
                  setRecommendation("undefined");
                }
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
    console.log("vote clicked", event.target.name);
    console.log(event)
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
          sx={{ width: 255 }}
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
              ? "Suggestion is based on the songs in the queue. Queue up at least 3 songs to see your suggestion."
              : recommendation.title}
          </Typography>
          <Typography variant="h7">
            {recommendation == null ||
              recommendation === undefined ||
              recommendation == "undefined"
              ? ""
              : recommendation.artist}
          </Typography>
          <br />
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
              onClick={(event) => handleVote(event)}
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
              onClick={(event) => handleVote(event)}
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
            totalVotes={totalVoteCount}
          />
        </CardContent>
      </Paper>
    </Card>
  );
}

export default SongSuggestion;
