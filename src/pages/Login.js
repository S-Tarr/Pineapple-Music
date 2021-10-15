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
 
 function Login() {
   const emailRef = useRef();
   const passwordRef = useRef();
   const { login } = useAuth();
   const [error, setError] = useState(""); // Error represents the current message we want displayed, no error message by default
   const [loading, setLoading] = useState(false); // Loading represents the current state of the button, enabled by default
   const history = useHistory();
    
   async function handleSubmit(e) {
     e.preventDefault();
 
     try {
       setError("");
       setLoading(true); // disable the login button
       await login(emailRef.current.value, passwordRef.current.value);
       history.push("/"); // redirect user to main page
     } catch {
       setError("Failed to log in");
     }
 
     setLoading(false); // enable the login button
   }
 
   return (
     <Container
       align="center"
       className="d-flex align-items-center justify-content-center"
       style={{ minHeight: "100vh" }}
     >
       <div className="w-100" style={{ maxWidth: "400px" }}>
         <Card>
           <CardContent>
             <h2 className="text-center mt-4">Log In</h2>
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
             <Button
               disabled={loading}
               className="w-100"
               type="submit"
               onClick={handleSubmit}
             >
               Log In
             </Button>
           </CardContent>
         </Card>
         <div className="w-100 text-center mt-2">
           Need an account? <Link to="/signup">Sign Up</Link>
         </div>
       </div>
     </Container>
   );
 }
 
 export default Login;
 