'use client'

import { registerSchema, useRegister } from "@/features/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
    const router = useRouter();
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
                onSuccess: () => {
                    router.push(`/check-email?email=${encodeURIComponent(formData.email)}`);
                },
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
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Регистрация</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Имя (необязательно)</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Пароль (минимум 6 символов)</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
                    disabled={isPending}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isPending ? '#ccc' : '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isPending ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Уже есть аккаунт? <Link href="/login" style={{ color: '#0070f3' }}>Войти</Link>
            </p>
        </div>
    )
}