import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, TextField, Typography } from "@mui/material";
import app from "../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useAuth } from "../contexts/AuthContext";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

function GroupSessionForm(props) {
  const nameRef = useRef();
  const idRef = useRef();

  const { addGroupSession } = useAuth();
  const [error, setError] = useState(""); // Error represents the current message we want displayed, no error message by default

  async function handleSubmit(e) {
    e.preventDefault();

    //Validation Checks
    const re = /^\d{4}$/;
    if (!re.test(String(idRef.current.value))) {
      return setError("Session ID must be 4 digits");
    }

    const groupSessionsQuery = query(collection(db, "groupSessions"));
    const groupSessionsQuerySnapshot = await getDocs(groupSessionsQuery);
    let sessionIdExists = false;
    groupSessionsQuerySnapshot.forEach((doc) => {
      if (doc.data().sessionId === idRef.current.value) {
        sessionIdExists = true;
        return setError("Session ID already exists");
      }
    });
    if (sessionIdExists) {
      return setError("Session ID already exists");
    }

    const userSessionsQuery = query(
      collection(db, "groupSessions"),
      where("ownerUid", "==", auth.currentUser.uid)
    );
    const userSessionsQuerySnapshot = await getDocs(userSessionsQuery);
    let sessionNameExists = false;
    userSessionsQuerySnapshot.forEach((doc) => {
      if (doc.data().name === nameRef.current.value) {
        sessionNameExists = true;
        return setError("Session name already exists with your uid");
      }
    });
    if (sessionNameExists) {
      return setError("Session name already exists with your uid");
    }

    //Add session to the page and to the database
    props.onSubmit(nameRef.current.value, idRef.current.value);
    addGroupSession(nameRef.current.value, idRef.current.value);
  }

  useEffect(() => {}, [error]);

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Create a new session
      </Typography>
      {error && <Alert variant="danger">{error}</Alert>}
      <form noValidate>
        <TextField
          required
          id="name"
          name="name"
          type="name"
          label="Group Session Name"
          variant="filled"
          inputProps={{ maxLength: 15 }}
          inputRef={nameRef}
          fullWidth
        />
        <TextField
          required
          id="id"
          name="id"
          type="id"
          label="Session ID (4 digits)"
          variant="filled"
          inputProps={{ maxLength: 4 }}
          inputRef={idRef}
          fullWidth
        />
        <br />
        <br />
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default GroupSessionForm;
