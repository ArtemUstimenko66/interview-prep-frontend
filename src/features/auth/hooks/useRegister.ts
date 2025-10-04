'use client'

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RegisterCredentials } from "@/features/auth/types/auth.types";
import { authApi } from "@/features/auth/api/auth.api";

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (data: RegisterCredentials) => authApi.register(data),
        onSuccess: () => {
            router.push('/login')
        }
    })
}