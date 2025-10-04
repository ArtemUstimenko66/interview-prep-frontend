'use client'

import { useAuth } from "@/features/auth";
import Link from "next/link";

export  const Header = () => {
    const { user, logout, isAuthenticated } = useAuth()

    return (
        <header>
            <nav>
                <Link href="/">Главная</Link>
                <Link href="/dashboard">Дашборд</Link>

                {isAuthenticated && (
                    <>
                        <span>Hello, {user?.name || user?.email}</span>
                        <button onClick={logout}>Log Out</button>
                    </>
                    )}
            </nav>
        </header>
    )
}