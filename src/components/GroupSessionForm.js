import React, { useRef, useState } from "react";
import { Alert, Button, TextField, Typography } from "@mui/material";

import { useAuth } from "../contexts/AuthContext";

function GroupSessionForm(props) {
  const nameRef = useRef();
  const idRef = useRef();

  const { addGroupSession } = useAuth();
  const [error, setError] = useState(""); // Error represents the current message we want displayed, no error message by default

  async function validateInputs() {
    const re = /^\d{4}$/;
    if (!re.test(String(idRef.current.value).toLowerCase())) {
      return setError("Session ID not valid");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    validateInputs();
    props.onSubmit(nameRef.current.value, idRef.current.value);
    addGroupSession(nameRef.current.value, idRef.current.value);
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Create a new session
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <TextField
          required
          id="name"
          name="name"
          type="name"
          label="Group Session Name"
          variant="filled"
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
          inputRef={idRef}
          fullWidth
        />
        <br />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </>
  );
}

export default GroupSessionForm;
