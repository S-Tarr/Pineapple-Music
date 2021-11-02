import React, { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import app from "../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage(); //Firebase Storage
const db = getFirestore(app); // Firestore database

function ListInDrawer({ users }) {
  let key = 0;
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {users.map((user) => (
        <ListItem key={key++} alignItems="center">
          <ListItemAvatar>
            <Avatar alt={user.uid} src={user.imageUrl} />
          </ListItemAvatar>
          <ListItemText primary={user.uid} />
        </ListItem>
      ))}
    </List>
  );
}

function UserList({ sessionId }) {
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

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([]);
    const groupSessionRef = collection(db, "groupSessions");
    const groupSession = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    getDocs(groupSession).then((querySnapshot) => {
      let usersInSession = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data().users);
        usersInSession = doc.data().users;
      });
      usersInSession.forEach((uid) => {
        const props = { uid: uid, imageUrl: "" };
        console.log("looping through ids rn", uid);
        getDownloadURL(ref(storage, uid))
          .then((url) => {
            props.imageUrl = url;
            setUsers((users) => [...users, props]);
          })
          .catch(() => {
            setUsers((users) => [...users, props]);
          });
      });
    });
  }, [sessionId]);

  return (
    <div>
      <Fragment key={anchor}>
        <IconButton onClick={toggleDrawer(anchor, true)}>
          <PeopleAltIcon fontSize="large" />
        </IconButton>
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          <ListInDrawer users={users} />
        </SwipeableDrawer>
      </Fragment>
    </div>
  );
}

export default UserList;
