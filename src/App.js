import React from "react";
//import { Router, Route } from "react-router-dom";

//import logo from './logo.svg';
import "./App.css";
import GroupSession from "./pages/GroupSession";
import { Container } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";

function App() {
  console.log("signup here: " + GroupSession);
  return (
    <AuthProvider>
      <Signup />
    </AuthProvider>
  );
}

export default App;
