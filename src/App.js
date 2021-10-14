import React ,{useState,useEffect} from "react";
//import { Router, Route } from "react-router-dom";

//import logo from './logo.svg';
import "./App.css";
import GroupSession from "./pages/GroupSession";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import addProfilePicture from "./pages/AddProfilePicture/addProfilePicture";
import logo from './logo.jpg';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

import { Linking } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen( {navigation} ) {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="logo" width="100%" />
        <button onClick={() => Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley")} className="Profile-Button"><PersonOutlineIcon className="Profile-Icon"></PersonOutlineIcon></button>
      </div>
      <div className="screenDisplay">

      </div>
    </div>
  )
}

function App() {
  console.log("signup here: " + GroupSession);
  return (
    // <AuthProvider>
    //   <Signup />
    // </AuthProvider>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={addProfilePicture}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
