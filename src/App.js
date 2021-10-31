import './App.css';
import React, { useRef, useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import CreateGroup from './pages/CreateGroup';
import Navbar from './components/Navbar/Navbar'; 
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { AuthProvider } from "./contexts/AuthContext";
import GroupSession from "./pages/GroupSession";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import AddProfilePicture from "./pages/AddProfilePicture/addProfilePicture";
import Visualizer from "./pages/Visualizer";

const auth = getAuth();
export const NavBarContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigation, setNavigation] = useState(true);

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
    <Router>
      <AuthProvider>
        <NavBarContext.Provider value={navigation}>
        <Switch>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/resetpassword" component = {ResetPassword}/>
          {loggedIn ? 
            <div className="container" >
              {navigation ?
                <Navbar />
              : null}
              <div className="content">
                <Switch>
                  <Route exact path="/Pineapple-Music" component={Home} />
                  <Route path="/search" component={SearchPage} />
                  <Route path="/creategroup" component={GroupSession} />
                  <Route path="/myaccount" component={MyAccount} />
                  <Route path="/profilepicture" component={AddProfilePicture} />
                  <Route path="/song" component={SongPage}/>
                  <Route path="/visual">
                    <Visualizer navigation={navigation}/>
                  </Route>
                </Switch>
              </div>
            </div>

          : null
          // : <Redirect to="/login" />
        }
        </Switch>
        </NavBarContext.Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
