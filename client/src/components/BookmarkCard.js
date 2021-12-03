import React, { useEffect, useRef } from "react";
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
import Overlay from 'react-bootstrap/Overlay';

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
  const [show, setShow] = React.useState(false);
  const [buttonMessage, setMessage] = React.useState("Edit");
  let target = useRef();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShow = (event) => {
    console.log("Show: " + show);
    setShow(!show);
    if (show) {
      setMessage("Edit");
    }
    else {
      setMessage("Close");
    }
  }

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
        <Button size="small" ref={target} onClick={handleShow.bind(this)}>
          {buttonMessage}
        </Button>
        <Overlay target={target.current} show={show} placement="bottom">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                    {...props}
                    style={{
                        display: "flex",
                        flexDirection:"column",
                        margin:"50px",
                        backgroundColor: "#202020",
                        padding: '2px 10px',
                        color: 'white',
                        width:"300px",
                        height:"200px",
                        borderRadius: 50,
                        textAlign:"center",
                        ...props.style,
                    }}
                >
                    <text>Edit Bookmark</text>
                    <div style={{backgroundColor:"#202020"}}>
                      <input type="text"></input>
                      <input type="submit"></input>
                    </div>
                </div>
                )}
            </Overlay>
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
