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

import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

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
     */
    function signup(email, password) {
      return auth.createUserWithEmailAndPassword(email, password)
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
