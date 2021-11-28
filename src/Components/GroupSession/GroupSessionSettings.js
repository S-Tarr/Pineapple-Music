import React, { Fragment, useEffect, useState } from "react";
import {
  IconButton,
  SwipeableDrawer,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const useStyles = makeStyles({
  paper: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },
});

const db = getFirestore(app); // Firestore database

function ListInDrawer({ sessionId, queueing, setQueueing, pps, setPps, updatePermissions }) {
  const handlePps = (event) => {
    setPps(!pps);
    updatePermissions(sessionId, "pps", !pps);
  };

  const handleQueueing = (event) => {
    setQueueing(!queueing);
    updatePermissions(sessionId, "queueing", !queueing);
  };

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
          Settings
        </Typography>{" "}
      </div>
        <FormGroup>
            <FormControlLabel
              control={
                  <Switch checked={queueing} onChange={handleQueueing} name="queueing" />
              }
              label="Queueing"
            />
            <FormControlLabel
              control={
                  <Switch checked={pps} onChange={handlePps} name="pps" />
              }
              label="Play/Pause/Skip"
            />
        </FormGroup>
      </div>
  );
}

function GetPermissions(sessionId, queueing, setQueueing, pps, setPps) {
  useEffect(() => {
    const groupSessionRef = collection(db, "groupSessions");
    const groupSession = query(
      groupSessionRef,
      where("sessionId", "==", sessionId)
    );
    const unsubscribe = onSnapshot(groupSession, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setQueueing(doc.data().queueing);
        setPps(doc.data().pps);
      });
    })
    return () => unsubscribe;
  }, [sessionId]);
}

function GroupSessionSettings({ sessionId }) {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const anchor = "right";
  const { updatePermissions, checkCreator } = useAuth();
  const [queueing, setQueueing] = useState();
  const [pps, setPps] = useState();
  const [disableSettings, setDisableSettings] = useState(true);
  const isOwnerPromise = checkCreator(sessionId)
    .then((result) => {
      return result;
    });
  const useOwnerPromise = () => {
    isOwnerPromise.then((result) => {
      if (result) {
        setDisableSettings(false);
      } else {
        setDisableSettings(true);
      }
    });
  };
  useOwnerPromise();
  GetPermissions(sessionId, queueing, setQueueing, pps, setPps);

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
        <IconButton
          onClick={toggleDrawer(anchor, true)}
          disabled={disableSettings}>
          <SettingsIcon fontSize="large" />
        </IconButton>
        <SwipeableDrawer
          classes={{ paper: classes.paper }}
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          <ListInDrawer sessionId={sessionId} queueing={queueing} setQueueing={setQueueing} pps={pps} setPps={setPps} updatePermissions={updatePermissions}/>
        </SwipeableDrawer>
      </Fragment>
    </div>
  );
}

export default GroupSessionSettings;