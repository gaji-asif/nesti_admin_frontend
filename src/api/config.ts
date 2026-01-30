import axios from "axios";

export const API_URL = 'https://api.nesticommunity.com/api';
//export const API_URL = 'http://localhost/NestiApp/public/api';
export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': undefined },
    //withCredentials: true, // important for Sanctum
});

// Add request interceptor to automatically include bearer token
api.interceptors.request.use(
    (config) => {
        // Use environment variable for the token (secure and configurable)
        const token = import.meta.env.VITE_API_TOKEN;

        if (token) {
            //add authorization header to the request
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