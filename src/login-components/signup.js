/**
 * Defines the Signup React component for the signup page.
 */

import React, { useRef, useState } from 'react'
import { Form, Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = useState("")  // Error represents the current message we want displayed, no error message by default
    const [loading, setLoading] = useState(false)  // Loading represents the current state of the button, disabled by default

    async function handleSubmit(e) {
      e.preventDefault()

      // Run our validation checks
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match")
      }

      try {
        setError("")
        setLoading(true) // disable the signup button
        await signup(emailRef.current.value, passwordRef.current.value)
      } catch {
        setError("Failed to create an account")
      }

      setLoading(false) // enable the signup button
    }

    return (
      <main>
        <Card>
            <Card.Body>
                <h2 className="text-center mt-4">Sign Up</h2>
                {currentUser && currentUser.email}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group id="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm">
                      <Form.Label>Password Confirmation</Form.Label>
                      <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                </Form>
                <Button disabled={loading} className="w-100" type="submit" onClick={handleSubmit}>Sign Up</Button>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account? Log In
        </div>
      </main>
    )
}
