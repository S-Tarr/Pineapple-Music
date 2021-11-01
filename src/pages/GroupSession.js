import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { getAuth } from "firebase/auth";

import GroupSessionCard from "../components/GroupSessionCard";
import GroupSessionForm from "../components/GroupSessionForm";
import { useAuth } from "../contexts/AuthContext";

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "40ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

function GroupSession() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { getGroupSessions, getYourGroupSessions, searchGroupSessions } = useAuth();
  const auth = getAuth();

  var date = new Date();
  var dateTime = date.toLocaleDateString();

  const props = {
    title: "group session title",
    imageUrl:
      "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
    username: "username goes here",
    createdAt: dateTime,
    sessionId: 1234,
  };

  const sessionIdRef = useRef();

  const [cards, addCard] = useState([]);
  const [loading, setLoading] = useState(true);

  const init = [];

  const handleSearch = () => {
    const getCards = searchGroupSessions(sessionIdRef.current.value).then(
      (session) => {
        console.log("in handleSearch");
        addCard([]);
        addCard(session);
      }
    );
  };

  useEffect(() => {
    const getCards = getGroupSessions().then((sessions) => {
      console.log("get cards");
      console.log(sessions);
      sessions.forEach((session) => {
        init.push(session);
      });
      addCard(cards.concat(init));
    });
    setLoading(false);
    //return () => getCards();
  }, [loading]);

  const handleCreate = (title, sessionId) => {
    props["title"] = title;
    props["sessionId"] = sessionId;
    props["username"] = auth.currentUser.uid;
    addCard(cards.concat(props));
  };

  return (
    <div className="Page">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Group Listening
      </Typography>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputRef={sessionIdRef}
          onChange={handleSearch}
          placeholder="Search group sessions using session ID"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <br />
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
              onSubmit={handleClose}
            >
              <Box sx={style}>
                <GroupSessionForm onSubmit={handleCreate} />
              </Box>
            </Modal>
            <br />
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
