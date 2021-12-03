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


async function updateCards(setCards) {
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
          
          var arr = []
          for (const [key, value] of Object.entries(doc.data().bookmarks)) {
            const props = {
              songName: "group session1",
              time: Infinity
            };
            props["songName"] = value["title"]
            props["time"] = value["time"]
            //setCards((cards) => [props, ...cards]);
            console.log("inside:", JSON.stringify(arr))
            arr.push(props)
            console.log(JSON.stringify(props))
            console.log("inside after", JSON.stringify(arr))
          }
          console.log("outside", arr)
          setCards(arr)
        }
      });
      
    })
}

// async function getMyBooks() {
//   const docSnapUsers = await getDocs(collection(db, "users"))
//   let bookmarks = null
//   docSnapUsers.forEach((currDoc) => {
//     if (currDoc.data().uid === auth.currentUser.uid) {
//       // for (const [key, value] of Object.entries(currDoc.data().bookmarks)) {
//       //   var temp = {"title": value["title"], "time": value["time"]}
//       //   console.log(value["title"], value["time"])
//       //   arr.push(temp)
//       // }
//       bookmarks = currDoc.data().bookmarks
//       console.log(bookmarks)
//     }
//   })
//   return bookmarks
// }

function Bookmarks() {
    const [isLoaded, setIsLoaded] = useState(true)
    const [bookmarks, setBookmarks] = useState([])
    const [cards, setCards] = useState([])
    
    let key = 0;  

    // useEffect(() => {
    //   console.log("rerender!")
    // }, [cards]);

    // updateCards(setCards);

  // useEffect(() => {
  //   var promise = getMyBooks()

  //     promise.then((ret) => {
  //       setBookmarks(ret)
  //       console.log(ret)
  //     })
  //     console.log(bookmarks)
  // }, [isLoaded]);

  // console.log(bookmarks)

  // if (!bookmarks) {
  //   console.log("ya yeet")
  //   setIsLoaded(false)
  // }
  // } else {
  //   bookmarks.forEach((value) => {
  //     cards.push(value)
  //   })
  // }
    useEffect(() => {
      updateCards(setCards);
    }, [])
    console.log(cards)
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
                  <BookmarkCard props={card}/>
                </Grid>))
              }
            </Grid>
          </Container>
        </div>
    )
}

export default Bookmarks
