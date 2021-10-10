/**
 * App file copy but specifically for testing the login components because I'm not totally sure
 * how to get it to work in the original App file.
 */

import React from "react";
import './App.css';
import Signup from "./login-components/signup"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from 'react-bootstrap'

function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
    <div className="w-100" style={{ maxWidth: "400px" }}>
        <Signup/>
    </div>
    </Container>
);
}

export default App;
