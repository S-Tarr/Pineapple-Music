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
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';

import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase";
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
  props: { title, username, createdAt, sessionId }, activeRoom
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    <ListItem disablePadding>
      <ListItemButton onClick={(event) => {
            copyId();
            handleClick(event);
            }}>
        <ListItemIcon>
            {activeRoom ? <MeetingRoomIcon /> : <NoMeetingRoomIcon />}
        </ListItemIcon>
        <ListItemText>{title}</ListItemText>
      </ListItemButton>
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
          <Typography sx={{ p: 2 }}>{username}<br></br>{createdAt}</Typography>
      </Popover>
    </ListItem>
  );
}

export default GroupSessionCard;