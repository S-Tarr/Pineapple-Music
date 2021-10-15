import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import GroupSession from "./pages/GroupSession";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import TestHomepage from "./pages/TestHomepage";
import PrivateRoute from "./components/PrivateRoute";
import Visualizer from "./pages/Visualizer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={TestHomepage}/> 
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/visual" component={Visualizer}/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
