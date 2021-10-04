/**
 * Builds the Signup form React component.
 */

import React, { useRef } from 'react'
import { Form, Card, Button} from 'react-bootstrap'
// import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    // const { signup } = useAuth()

    return (
      <main>
        <Card>
            <Card.Body>
                <h2 className="text-center mt-4">Sign Up</h2>
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
                <Button classname="w-100 text-center" type="submit">Sign Up</Button>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account? Log In
        </div>
      </main>
    )
}
