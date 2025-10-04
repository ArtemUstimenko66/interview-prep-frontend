'use client'

import { registerSchema, useRegister } from "@/features/auth";
import { useState } from "react";
import Link from "next/link";

export const RegisterForm = () => {
    const { mutate: register, isPending } = useRegister()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');

        try {
            registerSchema.parse(formData)
            register(formData, {
                onError: (err) => {
                    setError(err.message)
                },
            })
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
    }

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name (optional)</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>

                {error && <div>{error}</div>}

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Loading...' : 'Register'}
                </button>
            </form>

            <p>
                Already have an account? <Link href="/login">Login</Link>
            </p>
        </div>
    )
}