import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import LogoutButton from '../components/LogoutButton'

export default function TestHomepage() {
    const { currentUser } = useAuth();

    return (
        <div>
            <h2>Email: {currentUser.email}</h2>
            <LogoutButton />
        </div>
    )
}
