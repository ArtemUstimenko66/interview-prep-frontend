export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    password: string
    name?: string
}

export interface AuthResponse {
    user: {
        id: string
        email: string
        name?: string
    }
}

export interface VerifyEmailResponse {
    success: boolean
    message: string
}

export interface ResendVerificationResponse {
    message: string
}

export interface CheckEmailResponse {
    exists: boolean
    verified?: boolean
    message?: string
}