import React from "react";
import HomeScreen from "./HomeScreen"
import SpotifyLoginPage from "./SpotifyLoginPage"

const getParamsFromSpotifyAuth = (hash) => {
  console.log(hash.substring(1))
  const paramsUrl = hash.substring(1).split("?");
  console.log(paramsUrl)
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    console.log(value)
    return accumulator;
  }, {});
  return params;
};

console.log(window.location.hash)
//const code = getParamsFromSpotifyAuth(window.location.hash).code
const code = new URLSearchParams(window.location.search).get("code")
console.log("code: " + code);


function Home() {
  return code ? <HomeScreen code={code} /> : <SpotifyLoginPage />;
}

export default Home;
