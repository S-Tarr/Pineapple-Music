import './App.css';
import React, { useRef, useState, useEffect, useContext } from 'react';
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
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/resetpassword" component = {ResetPassword}/>

          {loggedIn ? 
          <div className="container">
            <Navbar />
            <div className="content">
              <Switch>
                <Route exact path="/Pineapple-Music" component={Home} />
                <Route path="/search" component={SearchPage} />
                <Route path="/creategroup" component={GroupSession} />
                <Route path="/myaccount" component={MyAccount} />
                <Route path="/profilepicture" component={AddProfilePicture} />
                <Route path="/song" component={SongPage}/>
                <Route path="/visual" component={Visualizer}/>
              </Switch>
            </div>
          </div>

          : <Redirect to="/login" />
        }
        </Switch>
        
        {/* <h1>{!!useContext(AuthProvider)}</h1> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
