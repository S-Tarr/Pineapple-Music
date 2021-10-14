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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* <PrivateRoute exact path="/" component={TestHomepage}/>  */}
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
        </Switch>
        <div className="container">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/creategroup" component={CreateGroup} />
              <Route path="/myaccount" component={MyAccount} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
