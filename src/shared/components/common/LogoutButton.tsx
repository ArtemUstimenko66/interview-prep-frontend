'use client'

import {useAuth} from "@/features/auth";

export const LogoutButton = () => {
    const { logout, isLoading } = useAuth()

    return (
        <button onClick={logout} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
}