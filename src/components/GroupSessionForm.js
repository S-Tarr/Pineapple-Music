import React, { useRef } from "react";
import { Button, TextField, Typography } from "@mui/material";

function GroupSessionForm(props) {
  const nameRef = useRef();
  const idRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(nameRef.current.value, idRef.current.value);
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Create a new session
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
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
          label="ID"
          variant="filled"
          inputRef={idRef}
          fullWidth
        />
        <br />
        <br />
        <Button
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
