/**
 * Defines the Signup React component for the signup page.
 */

import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom"

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState(""); // Error represents the current message we want displayed, no error message by default
  const [loading, setLoading] = useState(false); // Loading represents the current state of the button, enabled by default
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    // Run our validation checks
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true); // disable the signup button
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push("/"); // redirect user to main page
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false); // enable the signup button
  }

  return (
    <Container
      align="center"
      justifyContent="center"
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <CardContent>
            <h2 className="text-center mt-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <TextField
              required
              id="email"
              name="email"
              type="email"
              label="Email"
              variant="filled"
              inputRef={emailRef}
              fullWidth
            />
            <TextField
              required
              id="password"
              name="password"
              type="password"
              label="Password"
              variant="filled"
              inputRef={passwordRef}
              fullWidth
            />
            <TextField
              required
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="ConfirmPassword"
              variant="filled"
              inputRef={passwordConfirmRef}
              fullWidth
            />
            <Button
              disabled={loading}
              className="w-100"
              type="submit"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </CardContent>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
}

export default Signup;
