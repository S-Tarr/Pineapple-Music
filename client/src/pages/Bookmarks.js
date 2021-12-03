import { React, useState, useEffect, useRef } from 'react'
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkCard from "../components/BookmarkCard"
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputBase,
  LinearProgress,
  CircularProgress,
  Modal,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SwipeableDrawer,
  Paper,
} from "@mui/material";

import { getAuth } from "firebase/auth";
import {
  getDocs,
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";

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
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 0, 1, 0),
        // // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
    },
  }));

const db = getFirestore(app); // Firestore database
const auth = getAuth();


async function updateCards(setCards, cards) {
  console.log("updating!")
  const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
  getDocs(q)
    .then((docSnap) => {
      docSnap.forEach((doc) => {
        console.log("uid:", doc.data().uid)
        if (
          doc.data().bookmarks !== undefined &&
          doc.data().bookmarks != null &&
          doc.data().bookmarks !== "undefined"
        ) {
          for (const [key, value] of Object.entries(doc.data().bookmarks)) {
            const props = {
              songName: "song name",
              time: Infinity
            };
            console.log("song/time", key, value["time"])
            props["songName"] = key;
            props["time"] = value["time"]
            setCards(cards => [...cards, props]);
          }
          console.log(JSON.stringify(cards))
        }
        
      });
    })
}

function Bookmarks() {
    const [searchStr, setSearchStr] = useState("");
    const [cards, setCards] = useState([]);
    
    
    let key = 0;

    // useEffect(() => {
    //   console.log("rerender!")
    // }, [cards]);

    updateCards(setCards, cards);
    return (
        <div className="Page" align="center">
          <Typography
              sx={{ fontWeight: "bold", pt: 3}}
              variant="h3"
              component="div"
              gutterBottom
          >
              Bookmarks
          </Typography>

            {/* <Search>
                <SearchIconWrapper> <SearchIcon /> </SearchIconWrapper>
                <StyledInputBase
                    value={searchStr}
                    onChange={(e) => setSearchStr(e.target.value)}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                />
            </Search> */}
          <Container maxWidth="md" sx={{ marginTop: 2, paddingBottom: 4 }}>
            <Grid container alignItems="center" spacing={9}>
              {cards.map((card) => (
                <Grid item key={key++} xs={12} sm={6} md={4}>
                  <BookmarkCard props={card} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
    )
}

export default Bookmarks
