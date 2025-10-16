'use client'

import { useState } from "react";
import { loginSchema, useAuth, authApi } from "@/features/auth";
import Link from "next/link";
import { z } from "zod";
import {signIn} from "next-auth/react";

type LoginStep = 'email' | 'password';

export const LoginForm = () => {
    const { login, isLoading: isAuthLoading } = useAuth()
    const [step, setStep] = useState<LoginStep>('email')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsCheckingEmail(true)
        try {
            await signIn('google', { callbackUrl: '/dashboard' })
        } catch (err) {
            setError('Failed to sign in with Google.')
            setIsGoogleLoading(false)
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');

        try {
            z.string().email('Invalid email address').parse(email)

            setIsCheckingEmail(true)
            const result = await authApi.checkEmail(email)

            if (!result.exists) {
                setError('User with this email not found. Please register first.')
                return
            }

            if (result.verified === false) {
                setError('Please verify your email before logging in. Check your inbox.')
                return
            }

            setStep('password')

        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.message)
            } else if (err instanceof Error) {
                setError('Failed to check email. Please try again.')
            }
        } finally {
            setIsCheckingEmail(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');

        try {
            loginSchema.parse({ email, password })
            await login({ email, password })
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
    }

    const handleBack = () => {
        setStep('email')
        setPassword('')
        setError('')
    }

    const isLoading = isCheckingEmail || isAuthLoading

    return (
        <div style={{maxWidth: '400px', margin: '50px auto'}}>
            <h2>Login</h2>

            <button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    color: '#444',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: '500'
                }}
            >
                {isGoogleLoading ? (
                    'Signing in...'
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4"
                                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                            <path fill="#34A853"
                                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                            <path fill="#FBBC05"
                                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                            <path fill="#EA4335"
                                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                        </svg>
                        Continue with Google
                    </>
                )}
            </button>

            {step === 'email' ? (
                <form onSubmit={handleEmailSubmit}>
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            disabled={isCheckingEmail}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '15px',
                            backgroundColor: '#fee',
                            color: '#c00',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isCheckingEmail}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: isCheckingEmail ? '#ccc' : '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isCheckingEmail ? 'not-allowed' : 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {isCheckingEmail ? 'Checking...' : 'Next'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handlePasswordSubmit}>
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="email-display">Email</label>
                        <div style={{
                            padding: '8px',
                            marginTop: '5px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{email}</span>
                            <button
                                type="button"
                                onClick={handleBack}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#0070f3',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            disabled={isAuthLoading}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '15px',
                            backgroundColor: '#fee',
                            color: '#c00',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{display: 'flex', gap: '10px'}}>
                        <button
                            type="submit"
                            disabled={isAuthLoading}
                            style={{
                                flex: 2,
                                padding: '10px',
                                backgroundColor: isAuthLoading ? '#ccc' : '#0070f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isAuthLoading ? 'not-allowed' : 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            {isAuthLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            )}

            <p style={{marginTop: '20px', textAlign: 'center'}}>
                Don't have an account? <Link href="/register" style={{color: '#0070f3'}}>Register</Link>
            </p>
        </div>
    )
}