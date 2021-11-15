import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Popover,
} from "@mui/material";
import { useHistory } from "react-router";

import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

async function handleSubmitGroup(groupID) {
  const userRef = collection(db, "users");
  await updateDoc(doc(userRef, auth.currentUser.uid), {
    currentGroup: groupID,
  });
}

function GroupSessionCard({
  props: { title, imageUrl, username, createdAt, sessionId },
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { joinGroupSession, updateUserState } = useAuth();

  const history = useHistory();
  async function handleJoin() {
    handleSubmitGroup(sessionId);
    joinGroupSession(sessionId, username);
    history.push({
      pathname: "/groupsessionhome",
      props: {
        title: title,
        imageUrl: imageUrl,
        username: username,
        createdAt: createdAt,
        sessionId: sessionId,
      },
    });
  }

  let path = window.location.pathname;
  /* potentially changes navbar on page change */
  useEffect(() => {
    if (window.location.pathname !== "/groupsessionhome") {
      updateUserState();
    }
  }, [path]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const copyId = () => {
    navigator.clipboard.writeText(sessionId);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt="group session image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Owner UID: {username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created at: {createdAt}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleJoin}>
          Join
        </Button>
        <Button
          size="small"
          onClick={(event) => {
            copyId();
            handleClick(event);
          }}
        >
          Session ID: {sessionId}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>Session ID copied.</Typography>
        </Popover>
      </CardActions>
    </Card>
  );
}

export default GroupSessionCard;
