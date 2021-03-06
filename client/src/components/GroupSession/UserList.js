import React, { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import app from "../../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const useStyles = makeStyles({
  paper: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },
});

const storage = getStorage(); //Firebase Storage
const db = getFirestore(app); // Firestore database

function ListInDrawer({ sessionId }) {
  const users = GetUsers(sessionId);
  users.sort((a, b) => a.active.localeCompare(b.active));
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
          Group Members
        </Typography>{" "}
      </div>
      <List>
        {users.map((user) => (
          <ListItem key={key++} alignItems="center">
            <ListItemAvatar>
              <Avatar alt={user.uid} src={user.imageUrl} />
            </ListItemAvatar>
            <ListItemText primary={user.uid.substring(0, 20)} />
            <ListItemIcon>
              {user.active === "active" ? (
                <FiberManualRecordIcon color="success" />
              ) : (
                <FiberManualRecordIcon color="disabled" />
              )}
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

function GetUsers(sessionId) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([]);
    const groupSessionRef = collection(db, "groupSessions");
    const groupSession = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSession, (querySnapshot) => {
      let usersInSession = [];
      querySnapshot.forEach((doc) => {
        usersInSession = doc.data().users;
        setUsers([]);
        Object.keys(usersInSession).forEach((uid) => {
          const props = { uid: uid, imageUrl: "", active: usersInSession[uid] };
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

    })
    return () => unsubscribe;

    // getDocs(groupSession).then((querySnapshot) => {
    //   let usersInSession = [];
    //   querySnapshot.forEach((doc) => {
    //     usersInSession = doc.data().users;
    //   });
    //   Object.keys(usersInSession).forEach((uid) => {
    //     const props = { uid: uid, imageUrl: "", active: usersInSession[uid] };
    //     getDownloadURL(ref(storage, uid))
    //       .then((url) => {
    //         props.imageUrl = url;
    //         setUsers((users) => [...users, props]);
    //       })
    //       .catch(() => {
    //         setUsers((users) => [...users, props]);
    //       });
    //   });
    // });
  }, [sessionId]);
  return users;
}

function UserList({ sessionId }) {
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
        {/* onClick={toggleDrawer(anchor, true)}  */}
        <IconButton onClick={toggleDrawer(anchor, true)}>
          <PeopleAltIcon fontSize="large" />
        </IconButton>
        <SwipeableDrawer
          classes={{ paper: classes.paper }}
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          <ListInDrawer sessionId={sessionId} />
        </SwipeableDrawer>
      </Fragment>
    </div>
  );
}

export default UserList;
