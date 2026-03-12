import { api, ApiResponse } from "./config";
export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse<unknown>> => {
    try {
        const response = await api.post("/login", credentials);
        return response.data as ApiResponse<unknown>;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};