"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginCredentials } from "@/features/auth/types/auth.types";

export const useAuth = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    const login = async(credentials: LoginCredentials) => {
        const result = await signIn('credentials', {
            ...credentials,
            redirect: false,
        })

        if(result?.error) {
            throw new Error(result.error)
        }

        router.push('/dashboard')
    }

    const logout = async () => {
        await signOut({ redirect: false })
        router.push('/login')
    }

    return {
        user: session?.user,
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        login,
        logout,
    }
}