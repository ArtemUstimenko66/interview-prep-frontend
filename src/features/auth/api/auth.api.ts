import axios from "axios";
import {AuthResponse, LoginCredentials, RegisterCredentials} from "@/features/auth/types/auth.types";
import {apiClient} from "@/lib/api-client";


export const authApi = {
    register: async (data: RegisterCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
        return response.data
    },
}