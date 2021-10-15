import React, { useState } from "react";
import Input from "../components/Input.js"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

function ResetPassword() {
   const [email, setEmail] = useState('');

   function printEmail(e) {
      setEmail(e.target.value);
   }

   function sendResetEmail(){
      var auth = getAuth();
      var resetEmail = email;
      console.warn(email);

      if (email != "") {
         try {
            sendPasswordResetEmail(auth, resetEmail)
            window.alert("An email has been sent.");
         } catch {
            window.alert("There was an error.");
         }
      }
      else {
         window.alert("Please enter an email.");
      }
   }

   return (
      <div className="input-container">
         <h1>
            Reset Password
         </h1>
         <input placeholder="Email Address" type="text" onChange={printEmail}/>
         <button onClick={sendResetEmail}>Confirmation Email</button>
      </div>
   )
}


export default ResetPassword
