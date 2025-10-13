'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth";
import Link from "next/link";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');

    const { mutate: verifyAndLogin, isPending, isSuccess, isError} = useMutation({
        mutationFn: authApi.verifyAndLogin,
        onSuccess: (data) => {
            setMessage(data.message);
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1000);
        },
        onError: (err: any) => {
            setMessage(err.response?.data?.error || 'Verification error');
        }
    })

    useEffect(() => {
        if(token) verifyAndLogin(token);
    }, [token, verifyAndLogin]);

    const status = !token ? 'error' : isPending ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'loading';

    return (
        <div>
            {status === 'loading' && (
                <div>
                    <h1>Verifying email...</h1>
                    <p>Please wait while we verify your email.</p>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <h1>✅ Успешно!</h1>
                    <p>{message}</p>
                    <p>Перенаправление на страницу входа...</p>
                    <Link href="/login">
                        Перейти к входу сейчас
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <h1 style={{ color: 'red' }}>❌ Ошибка</h1>
                    <p>{!token ? 'Токен верификации не найден' : message}</p>
                    <div>
                        <Link href="/resend-verification">
                            Отправить письмо повторно
                        </Link>
                        <Link href="/login">
                            Вход
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

