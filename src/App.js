import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import CreateGroup from './pages/CreateGroup';
import Navbar from './components/Navbar/Navbar'; 

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
