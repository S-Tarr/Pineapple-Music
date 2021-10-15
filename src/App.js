import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import CreateGroup from './pages/CreateGroup';
import Navbar from './components/Navbar/Navbar'; 
import GroupSession from "./pages/GroupSession";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import TestHomepage from "./pages/TestHomepage";
import PrivateRoute from "./components/PrivateRoute";
import SongPage from "./pages/SongPage";
import addProfilePicture from "./pages/AddProfilePicture/addProfilePicture";
import AddProfilePicture from './pages/AddProfilePicture/addProfilePicture';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Visualizer from "./pages/Visualizer";

function App() {

  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* <PrivateRoute exact path="/" component={TestHomepage}/>  */}
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/visual" component={Visualizer}/>
        </Switch>
        <div className="container">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/creategroup" component={GroupSession} />
              <Route path="/myaccount" component={MyAccount} />
              <Route path="/profilepicture" component={AddProfilePicture} />
              <Route path="/song" component={SongPage}/>
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
