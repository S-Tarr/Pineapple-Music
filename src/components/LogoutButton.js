import { Button } from '@mui/material'
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router';

function LogoutButton() {
  const { logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    try {
      await logout()
      history.push("/login")
    } catch {
      console.log("Failed to logout.")
    }
  }

  return (
    <Button variant="link" onClick={handleLogout}>
        Log out
    </Button>
  )
}

export default LogoutButton;