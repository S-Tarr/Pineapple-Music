import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Popover
} from "@mui/material";
import { useHistory } from "react-router";

import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

function GroupSessionCard({
  props: { trackId, songName, time },
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { editBookmark, delBookmark } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  console.log("bookmark", songName, time)
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Song Name: {songName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bookmark Time: {time}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={editBookmark(trackId, time)}>
          Edit
        </Button>
        <Button size="small" onClick={delBookmark(trackId)}>
          Delete
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
        </Popover>
      </CardActions>
    </Card>
  );
}

export default GroupSessionCard;
