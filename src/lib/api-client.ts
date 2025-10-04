import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXTAUTH_URL || '',
    headers: {
        'Content-Type': 'application/json'
    },
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            window.location.href = '/login'
        }
        return Promise.reject(error);
    }
)