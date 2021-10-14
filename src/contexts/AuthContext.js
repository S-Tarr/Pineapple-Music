/**
 * React context storing logged in user information.
 * 
 * Contexts:
 * "In a typical React application, data is passed top-down (parent to child) via props,
 * but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme)
 * that are required by many components within an application. Context provides a way to share
 * values like these between components without having to explicitly pass a prop through every
 * level of the tree."
 */

import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import "firebase/firestore"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * @returns The current user to be used anywhere in the application
 */
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()

    /**
     * Calls the firebase function to signup with username and password.
     * 
     * Utilized in 'signup.js'
     */
    function signup(email, password) {
      // console.log(params)
      const created = createUserWithEmailAndPassword(auth, email, password)
      .then(registeredUser => {
        this.firestore.collection("users")
        .add({
          uid: registeredUser.user.uid,
          SpotifyToken: "testing testing"
        })
      }
      );
      return created;
    }

    /**
     * Sets the current user when the state changes and unsubscribes from the listener after.
     */
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
      })

      return unsubscribe
    }, [])

    const value = {
      currentUser,
      signup
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
