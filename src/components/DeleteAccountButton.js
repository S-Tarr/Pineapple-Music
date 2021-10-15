import { Button } from '@mui/material'
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router';

function DeleteAccountButton() {
  const { deleteAccount } = useAuth()
  const history = useHistory()

  async function handleDelete() {
    try {
      await deleteAccount()
      history.push("/login")
    } catch (e) {
        console.log("Failed to delete account.")
    }
  }

  return (
    <Button variant="link" onClick={() => {
      if (window.confirm('Are you sure you wish to delete your account?')) {
        handleDelete()
      }}}>
        Delete Account
    </Button>
  )
}

export default DeleteAccountButton;