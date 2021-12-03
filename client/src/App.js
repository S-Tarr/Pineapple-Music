import "./App.css";
import React, { useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import MyAccount from "./pages/MyAccount";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./contexts/AuthContext";
import GroupSession from "./pages/GroupSession";
import GroupSessionJoined from "./pages/GroupSessionJoined";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import History from "./pages/History";
import Bookmarks from "./pages/Bookmarks";
import AddProfilePicture from "./pages/AddProfilePicture/addProfilePicture";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const auth = getAuth();
export const NavBarContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
      console.warn(loggedIn);
    } else {
      setLoggedIn(false);
      console.warn(loggedIn);
    }
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/resetpassword" component={ResetPassword} />
            {
              loggedIn ? (
                <div className="container">
                  <Navbar />
                  <div className="content">
                    <Switch>
                      <Route exact path="/Pineapple-Music" component={Home} />
                      <Route path="/search" component={SearchPage} />
                      <Route path="/creategroup" component={GroupSession} />
                      <Route path="/myaccount" component={MyAccount} />
                      <Route
                        path="/profilepicture"
                        component={AddProfilePicture}
                      />
                      <Route path="/bookmarks" component={Bookmarks} />
                      <Route path="/song" component={SongPage} />
                      <Route
                        path="/groupsessionhome"
                        component={GroupSessionJoined}
                      />
                      <Route path="/history" component={History} />
                    </Switch>
                  </div>
                </div>
              ) : null
              // : <Redirect to="/login" />
            }
          </Switch>
        </AuthProvider>
      </Router>
    </DndProvider>
  );
}

export default App;
