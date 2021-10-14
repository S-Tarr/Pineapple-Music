import React from "react";
//import { Router, Route } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import GroupSession from "./pages/GroupSession";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <Signup />
    </AuthProvider>
  );
}

export default App;
