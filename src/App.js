import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import GroupSession from "./pages/GroupSession";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import TestHomepage from "./pages/TestHomepage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/Pineapple-Music/" component={TestHomepage}/> 
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
