import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import GroupSessionCard from "../components/GroupSessionCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function GroupSession() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  var date = new Date();
  var dateTime = date.toLocaleDateString();

  // example props added for testing
  const props = {
    title: "group session1",
    imageUrl:
      "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
    username: "username1",
    createdAt: dateTime,
    sessionId: 1234,
  };
  const cards = [props, props, props, props, props];

  return (
    <div>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Group Listening
      </Typography>
      <Container maxWidth="md">
        <Grid container alignItems="center" justifyContent="center" spacing={9}>
          <Grid
            justifyContent="center"
            align="center"
            item
            xs={12}
            sm={6}
            md={4}
          >
            <IconButton color="primary" onClick={handleOpen}>
              <AddCircleIcon sx={{ fontSize: 80 }} />
            </IconButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Test modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Add a form here
                </Typography>
              </Box>
            </Modal>
            <br />
            Create a new session
          </Grid>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <GroupSessionCard props={card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default GroupSession;
