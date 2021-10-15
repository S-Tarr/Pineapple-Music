import './App.css';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import CreateGroup from './pages/CreateGroup';
import Navbar from './components/Navbar/Navbar'; 
import GroupSession from "./pages/GroupSession";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from "./components/PrivateRoute";
import SongPage from "./pages/SongPage";
import SearchPage from './pages/SearchPage';
import AddProfilePicture from './pages/AddProfilePicture/addProfilePicture';
import Visualizer from "./pages/Visualizer";

const auth = getAuth();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // let loggedIn = true;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
      console.warn(loggedIn);
    } else {
      setLoggedIn(false);
      console.warn(loggedIn);
    }
  });

  // useEffect(() => {
  //   var auth = getAuth();
  //   var user = auth.currentUser;

  //   if (!!user) {
  //     loggedIn = true;
  //     console.log(loggedIn, user);
  //   } else {
  //     loggedIn = false;
  //     console.log(loggedIn, user);
  //   }
  // // }, []);
  // constructor(props){
  //   super(props);
    
  //   this.state = {
  //       picture: false,
  //       src: false
  //   }

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       currentUser = auth.currentUser;
  //       photo = currentUser.photoURL;
  //       if (photo != null) {
  //           this.setState({
  //               src: photo
  //           });
  //       }
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //       console.log("NOT CORRECT");
  //     }
  //   });
  // }
  // constructor(props) {
  //   super(props);
  // }
  
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/resetpassword" component = {ResetPassword}/>
        </Switch>
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

          : null
        }
        {/* <h1>{!!useContext(AuthProvider)}</h1> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
