'use client'

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth";

export default function CheckEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    const { mutate: resendEmail, isPending } = useMutation({
        mutationFn: authApi.resendVerification,
        onSuccess: () => {
            setCountdown(60);
        }
    });

    if (!email) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ color: 'red' }}>Ошибка</h1>
                <p>Email не найден</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '500px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: 'green', marginBottom: '20px' }}>✅ Регистрация успешна!</h1>

            <div style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                    Мы отправили письмо на
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3' }}>
                    {email}
                </p>
            </div>

            <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <p style={{ marginBottom: '15px' }}>
                    Проверьте почту и перейдите по ссылке для активации аккаунта
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    Не получили письмо? Проверьте папку "Спам"
                </p>
            </div>

            <div style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffc107'
            }}>
                {countdown > 0 ? (
                    <p style={{ margin: 0, color: '#856404' }}>
                        Повторная отправка доступна через <strong>{countdown}</strong> сек
                    </p>
                ) : (
                    <button
                        onClick={() => resendEmail(email)}
                        disabled={isPending}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isPending ? '#ccc' : '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isPending ? 'not-allowed' : 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {isPending ? 'Отправка...' : 'Отправить письмо повторно'}
                    </button>
                )}
            </div>
        </div>
    );
}