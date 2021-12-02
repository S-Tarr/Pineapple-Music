const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const { initializeApp } = require('firebase/app');
const { getAuth } = require("firebase/auth");
const { getFirestore, collection, doc, getDocs, updateDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB_IknUnLChJp9vG9kip0_Xu1YaqKed2Sk",
  authDomain: "pineapple-music-1ea51.firebaseapp.com",
  projectId: "pineapple-music-1ea51",
  storageBucket: "pineapple-music-1ea51.appspot.com",
  messagingSenderId: "171412581022",
  appId: "1:171412581022:web:bd4f9b6de4f7de0c17a98f",
  measurementId: "G-QZK0B417MX"
};

const fireApp = initializeApp(firebaseConfig);
const auth = getAuth(); // Authorization component
const db = getFirestore(fireApp); // Firestore database

async function handleSubmitToken(access_token, currentUser) {
  const docSnap = await getDocs(collection(db, "users"));
  console.log(currentUser)
  docSnap.forEach((data) => {
    if (data.data().uid === currentUser) {
      updateDoc(doc(db, "users", data.id), {
        SpotifyToken: access_token
      })
      .catch(err => {
        console.log(err)
      });
    }
  });
  console.log(`submitted token` + access_token)
}

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
  console.log("refresh called")

  const refreshToken = req.body.refreshToken
  const currentUser = req.body.currentUser
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'localhost:3000/Pineapple-Music',
    clientId: '477666821b8941c4bd163b4ff55ed9af',
    clientSecret: '5a9f7c25c73a46ca958cf138c64f1297',
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
      handleSubmitToken(data.body.access_token, currentUser)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
  console.log("login called")
  const code = req.body.code
  const currentUser = req.body.currentUser
  console.log(code)
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000/Pineapple-Music',
    clientId: '477666821b8941c4bd163b4ff55ed9af',
    clientSecret: '5a9f7c25c73a46ca958cf138c64f1297',
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
      handleSubmitToken(data.body.access_token, currentUser)
    })
    .catch(err => {
      console.log(err)  
      res.sendStatus(400)
    })
})

app.listen(3001)