import {
    AuthResponse,
    RegisterCredentials, ResendVerificationResponse,
    VerifyEmailResponse
} from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api-client";

export const authApi = {
    register: async (data: RegisterCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
        return response.data
    },
    verifyAndLogin: async (token: string): Promise<VerifyEmailResponse> => {
        const response = await apiClient.post<VerifyEmailResponse>('/api/auth/verify-and-login', { token })
        return response.data
    },
    resendVerification: async (email: string): Promise<ResendVerificationResponse> => {
        const response = await apiClient.post<ResendVerificationResponse>('/api/auth/resend-verification', { email })
        return response.data
    }
}