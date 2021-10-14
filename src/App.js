import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//import logo from './logo.svg';
import "./App.css";
import GroupSession from "./pages/GroupSession";
import { Container } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={GroupSession}/> 
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
