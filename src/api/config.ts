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
        // Get token from localStorage
        const authData = localStorage.getItem('nestiAuth');
        if (authData) {
            try {
                //Parse the stored auth data
                const parsedAuth = JSON.parse(authData);
                const token = parsedAuth.token;

                if (token) {
                    //add authorization header to the request
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing auth data from localStorage:', error);
            }
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
            // Clear invalid token from localStorage
            localStorage.removeItem('nestiAuth');
            localStorage.removeItem('nestiProfile');

            // Dispatch event to notify app about logout
            window.dispatchEvent(new CustomEvent('nestiLogout'));

            console.warn('Token expired or invalid. User logged out.');
        }
        return Promise.reject(error);
    }
);

export interface ApiResponse<T = any> {
    id: any;
    name: any;
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export async function bootstrapCsrf() {

    //   await axios.get('http://localhost/NestiApp/public/sanctum/csrf-cookie', {
    //     withCredentials: true,
    //   });

    //   await api.get('/sanctum/csrf-cookie');
    await api.get('http://localhost/NestiApp/public/sanctum/csrf-cookie');


}