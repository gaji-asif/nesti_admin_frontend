import axios from "axios";

const resolveApiBaseUrl = (): string => {
    // In local dev, use Vite proxy to avoid browser CORS restrictions.
    if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
        return '/api';
    }
    return import.meta.env.VITE_API_BASE_URL || 'https://api.nesticommunity.com/api';
};

export const api = axios.create({
    baseURL: resolveApiBaseUrl(),
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");

            if (typeof window !== "undefined" && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const bootstrapCsrf = async (): Promise<void> => {
    const rawBase = resolveApiBaseUrl();
    const csrfUrl = rawBase.startsWith('/api')
        ? '/sanctum/csrf-cookie'
        : `${rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase}/sanctum/csrf-cookie`;

    await axios.get(csrfUrl, {
        withCredentials: true,
    });
};