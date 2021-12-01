import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * The same as a normal route except that it checks to make sure we have
 * a current user before it allows access.
 */
export default function PrivateRoute({ component: Component, ...other}) {
  const { currentUser } = useAuth()
  return (
    <Route
      {...other}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    >
    </Route>
  )
}