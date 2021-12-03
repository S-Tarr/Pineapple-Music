import React from "react";
import HomeScreen from "./HomeScreen"
import SpotifyLoginPage from "./SpotifyLoginPage"

console.log(window.location.hash)
const code = new URLSearchParams(window.location.search).get("code")
console.log("code: " + code);


function Home() {
  return code ? <HomeScreen code={code} /> : <SpotifyLoginPage />;
}

export default Home;
