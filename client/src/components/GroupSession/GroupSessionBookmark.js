import React, { Fragment, useEffect, useState } from "react";
import {
    Avatar,
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SwipeableDrawer,
    Paper,
    Typography,
} from "@mui/material/";
import { makeStyles } from "@mui/styles";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import app from "../../firebase";
import {
    collection,
    getFirestore,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useAuth } from "../../contexts/AuthContext";
import albumCover from "../../assets/groupSessionAlbumCover.jpg";

const auth = getAuth(); // Authorization component

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
    clientId: "0fbe30c6e814404e8324aa3838a7f322",
    clientSecret: "e414b612d1ff45dd9ba6643e3161bdff",
    redirectUri: "localhost:3000/Pineapple-Music",
});

const db = getFirestore(app); // Firestore database

const useStyles = makeStyles({
    paper: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
    },
});

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


function BookmarksInDrawer({ bookmarks, songsInQueue }) {
    if (bookmarks == null || bookmarks === "undefined") {
        bookmarks = [];
    }

    let bookmarksToShow = [];

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }

    var bookmarksOwner = {};
    for (const [key, value] of Object.entries(bookmarks)) {
        console.log(value)
        bookmarksOwner[key] = millisToMinutesAndSeconds(value["time"]);
    }
    console.log(bookmarksOwner)

    console.log(songsInQueue);
    if (songsInQueue.length > 0) {
        songsInQueue.forEach((song) => {
            const songId = song.uri.substring(song.uri.lastIndexOf(":") + 1);
            if (bookmarksOwner[songId] != null) {
                song["time"] = bookmarksOwner[songId];
                bookmarksToShow.push(song);
            }
        });
    }

    let key = 0;
    return (
        <div>
            <br />
            <div align="center">
                <Typography
                    sx={{ fontWeight: "bold" }}
                    variant="h5"
                    component="div"
                    gutterBottom
                >
                    Host's bookmarks
                </Typography>{" "}
            </div>
            {bookmarksToShow.length > 0 ? (<List>
                {bookmarksToShow.map((bookmark) => (
                    <ListItem key={key++} alignItems="center">
                        <ListItemAvatar>
                            <Avatar sx={{ width: 100, height: 100 }}
                                variant="square" alt={bookmark.albumUrl} src={bookmark.albumUrl} />
                        </ListItemAvatar>
                        <ListItemText style={{padding:"13px", display:'flex', justifyContent:'center'}} primary={bookmark.title} />
                        {/* <Divider style={{display:'flex', justifyContent:'flex-end'}} orientation="vertical" /> */}
                        <ListItemText style={{padding:"13px", display:'flex', justifyContent:'flex-end'}}primary={bookmark.time} />
                    </ListItem>
                ))}
            </List>) : (
                <List>
                    <ListItem>
                        <ListItemText center primary={"No corresponding bookmarks for the songs in the queue"} />
                    </ListItem>
                </List>
            )}

        </div>
    );
}


function GroupSessionBookmark({ sessionId }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [songsInQueue, setSongsInQueue] = useState([]);

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
        console.log(access_token);
    }, [isLoaded])

    if (access_token == null) {
        setIsLoaded(false)
    }

    useEffect(() => {
        getDocs(collection(db, "groupSessions")).then((docSnapSessions) => {
            let ownerId = null;
            docSnapSessions.forEach((currDoc) => {
                if (currDoc.data().sessionId === sessionId) {
                    ownerId = currDoc.data().ownerUid;
                }
            });
            getDocs(collection(db, "users")).then((docSnapUsers) => {
                docSnapUsers.forEach((currDoc) => {
                    if (currDoc.data().uid === ownerId) {
                        console.log(currDoc.data().bookmarks);
                        setBookmarks(currDoc.data().bookmarks);
                    }
                })
            })
        })

        getDocs(collection(db, "groupSessionQueue")).then(
            (docSnapQueue) => {
                docSnapQueue.forEach((doc) => {
                    if (doc.data().sessionId === sessionId) {
                        setSongsInQueue(doc.data().songs);
                    }
                })
            }
        )

    }, [sessionId]);

    const classes = useStyles();
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const anchor = "right";

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    return (
        <div>
            <Fragment key={anchor}>
                <IconButton onClick={toggleDrawer(anchor, true)}>
                    <BookmarkIcon fontSize="large" />
                </IconButton>
                <SwipeableDrawer
                    classes={{ paper: classes.paper }}
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                >
                    <BookmarksInDrawer bookmarks={bookmarks} songsInQueue={songsInQueue} />
                </SwipeableDrawer>
            </Fragment>
        </div>
    );
}

export default GroupSessionBookmark;
