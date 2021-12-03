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
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
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
  setCurrSong
) {

  useEffect(() => {
    if (window.location.hash) {
      const params = getParamsFromSpotifyAuth(window.location.hash);
      spotifyApi.setAccessToken(params.access_token);
    }
  }, [window.location.search]);

  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSessionQuery, (querySnapshot) => {
      let currentSong = null;
      querySnapshot.forEach((currDoc) => {
        //Check if the current user voted or not
        currentSong = currDoc.data().currentSong;
        setCurrSong(currentSong);

        //Update total active user count
        const size = Object.values(currDoc.data().users).filter(
          (state) => state === "active"
        ).length;
        setTotalUsersInSession(size);

        let voteSet = new Set();
        if (
          currDoc.data().skipVotes != null &&
          currDoc.data().skipVotes !== "undefined" &&
          currDoc.data().skipVotes !== null &&
          currDoc.data().skipVotes != undefined
        ) {
          voteSet = new Set(Object.keys(currDoc.data().skipVotes));

          //Update upvoteCount and totalVoteCount
          const upvoteCountTemp = Object.values(currDoc.data().skipVotes).reduce(
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
    "Skipped song";
  const skippedMessage =
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "Skip song failed";

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

function SkipVotingCard({ sessionId }) {
  const [voted, setVoted] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [totalUsersInSession, setTotalUsersInSession] = useState(0);
  const [currSong, setCurrSong] = useState();

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
    setCurrSong
  );

  const [isLoaded, setIsLoaded] = useState(true);
  const [access_token, setAccessToken] = useState("");
  useEffect(() => {
    var promise = getAccessToken();
    promise.then((ret) => {
      setAccessToken(ret.SpotifyToken);
      spotifyApi.setAccessToken(ret.SpotifyToken);
    });
  }, [isLoaded])

  if (access_token == undefined) {
    setIsLoaded(false)
  }

  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSessionQuery = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    getDocs(groupSessionQuery).then((groupSessionQuerySnapshot) => {
      let currentSong = null;
      groupSessionQuerySnapshot.forEach((currDoc) => {
        try {
            //Check if song suggestion already exists
            currentSong = currDoc.data().currentSong;
            const downVotePercentage = 100 - (((upvoteCount * 1.0) / totalUsersInSession) * 100);
            const groupSessionQueueRef = collection(db, "groupSessionQueue");
            const groupSessionQueueQuery = query(
                groupSessionQueueRef,
                where("sessionId", "==", sessionId)
            );
            if (
                currentSong == null ||
                currentSong === undefined ||
                currentSong == "undefined" || 
                currDoc.data().queueOffset != currDoc.data().currSongOffset ||
                (totalVoteCount !== 0 && totalVoteCount === totalUsersInSession) ||
                (totalVoteCount !== 0 &&
                ((upvoteCount * 1.0) / totalUsersInSession) * 100 > 50)
            ) {
            //Song suggestion does not already exist (First song recommendation)
            // or upvote percentage greater than 50%
            // or every active user in the session has voted
            // therefore, get a new song to recommend

                console.log(
                    "current song is undefined or voting is over",
                    currentSong
                );

                //Refresh the votes value for the new song suggestion
                const sessionRef = doc(db, "groupSessions", currDoc.id);
                updateDoc(sessionRef, {
                    skipVotes: deleteField(),
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

                    {/*FLAG 3, HANDLE SKIP TO NEXT SONG IN GROUP SESSION QUEUE*/}
                    getDocs(groupSessionQueueQuery).then(
                        (groupSessionQueueQuerySnapshot) => {
                        groupSessionQueueQuerySnapshot.forEach((queueDoc) => {
                            const sessionRef = collection(db, "groupSessions");
                            const sessionRefQuery = query(
                                sessionRef,
                                where("sessionId", "==", sessionId)
                            );
                            
                            groupSessionQuerySnapshot.forEach((newdoc) => {
                                let offset = newdoc.data().queueOffset;
                                const newSessionRef = doc(db, "groupSessions", currDoc.id);
                                updateDoc(newSessionRef, {
                                    queueOffset: offset + 1
                                })
                            })                        
                        })

                        }
                    );
                } else if (totalVoteCount === totalUsersInSession) {
                    setAddedSongState({
                        open: true,
                        added: false,
                    });
                }

                //Get current song
                getDocs(groupSessionQueueQuery).then(
                  (groupSessionQueueQuerySnapshot) => {
                    let offset = 0;
                    let songs = [];
                    groupSessionQueueQuerySnapshot.forEach((doc) => {
                      songs = doc.data().songs;
                    });
                    
                    const sessionRef = collection(db, "groupSessions");
                    const sessionRefQuery = query(
                        sessionRef,
                        where("sessionId", "==", sessionId)
                    );
                    const newsessionRef = doc(db, "groupSessions", currDoc.id);
                    getDocs(sessionRefQuery).then((sessionRefQuerySnapshot) => {
                        sessionRefQuerySnapshot.forEach((doc) => {
                            offset = doc.data().queueOffset;
                            if (songs[offset] != undefined) {
                                updateDoc(newsessionRef, {
                                    currentSong: songs[offset],
                                    currSongOffset: offset,
                                });
                                setCurrSong(songs[offset]);
                            }
                        })
                    })
                  }
                );
            } else {
                getDocs(groupSessionQueueQuery).then(
                  (groupSessionQueueQuerySnapshot) => {
                    let offset = 0;
                    let songs = [];
                    groupSessionQueueQuerySnapshot.forEach((doc) => {
                      songs = doc.data().songs;
                    });
                    
                    const sessionRef = collection(db, "groupSessions");
                    const sessionRefQuery = query(
                        sessionRef,
                        where("sessionId", "==", sessionId)
                    );
                    const newsessionRef = doc(db, "groupSessions", currDoc.id);
                    getDocs(sessionRefQuery).then((sessionRefQuerySnapshot) => {
                        sessionRefQuerySnapshot.forEach((doc) => {
                            offset = doc.data().queueOffset;
                            if (songs[offset] != undefined) {
                                if (currentSong != songs[offset]) {
                                  updateDoc(newsessionRef, {
                                    currentSong: songs[offset],
                                    currSongOffset: offset,
                                  });
                                  setCurrSong(songs[offset]);
                                }
                                else {
                                  console.log("currentSuggestion is not undefined");
                                  setCurrSong(currentSong);
                                }
                            }
                        })
                    })
                  }
                );
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
          [`skipVotes.${auth.currentUser.uid}`]: `${event.target.name}`,
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
        <CardHeader color="primary" title="Skip Currently Playing?" />
        {/*change below to do current song stuff*/}
        <CardMedia
          align="center"
          component="img"
          sx={{ width: 255 }}
          image={
            currSong == null ||
              currSong === undefined ||
              currSong == "undefined"
              ? albumCover
              : currSong.albumUrl
          }
          alt="album cover"
        />
        <CardContent>
          <Typography variant="h6">
            {currSong == null ||
              currSong === undefined ||
              currSong == "undefined"
              ? "Suggestion is based on the current playing song. Play a song to vote."
              : currSong.title}
          </Typography>
          <Typography variant="h7">
            {currSong == null ||
              currSong === undefined ||
              currSong == "undefined"
              ? ""
              : currSong.artist}
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
                currSong == null ||
                currSong === undefined ||
                currSong == "undefined"
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
                currSong == null ||
                currSong === undefined ||
                currSong == "undefined"
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
          {/* SEE WHAT ADDEDSONGSTATE, HANDLEADDEDSONGCLOSE does */}
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

export default SkipVotingCard;
