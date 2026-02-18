import axios from "axios";

// Use a dev-relative URL so Vite dev server proxy handles CORS in development.
// In production use the real API host.
export const API_URL = import.meta.env.DEV ? '/api' : 'https://api.nesticommunity.com/api';
export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    // Do not set a global Content-Type so axios can choose per-request headers
    headers: {},
    //withCredentials: true, // important for Sanctum if backend requires cookies
});

// Add request interceptor to automatically include bearer token
api.interceptors.request.use(
    (config) => {
        // Prefer token stored in localStorage (user login) otherwise fall back to env token
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        const envToken = import.meta.env.VITE_API_TOKEN;
        const token = storedToken || envToken;

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized responses (token expired/invalid)
        if (error.response?.status === 401) {
            // Log the error but don't logout since we're using a temp token
            console.warn('Token expired or invalid. Using temp token - please check token validity.');
        }
        return Promise.reject(error);
    }
);

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    id?: unknown;
    name?: unknown;
}

export async function bootstrapCsrf() {

    //   await axios.get('http://localhost/NestiApp/public/sanctum/csrf-cookie', {
    //     withCredentials: true,
    //   });

    //   await api.get('/sanctum/csrf-cookie');
    await api.get('/sanctum/csrf-cookie');

}