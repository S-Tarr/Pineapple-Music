import React from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";

function GroupSessionForm() {
  const handleSubmit = (event) => {
      event.prevnetDefault();
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Create a new session
      </Typography>
      <form noValidate>
        <TextField
          required
          id="name"
          name="name"
          type="name"
          label="Name"
          variant="filled"
          fullWidth
        />
        <br />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default GroupSessionForm;