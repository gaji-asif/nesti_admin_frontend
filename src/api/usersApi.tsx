import { api } from "./config";

export interface UserProfile {
    id: number;
    user_id: number;
    users_img_url: string | null;
    postcode: string | null;
    location: string | null;
    bio: string | null;
    children_age_range: string[] | null;
    language: string[] | null;
    interests: string[] | null;
    profile_visibilty_status: string;
    created_at: string;
    updated_at: string;
    is_pregnent: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    lat: number | null;
    lng: number | null;
    is_active: boolean;
    first_name: string | null;
    last_name: string | null;
    is_friend: boolean | null;
    profile: UserProfile | null;
}

// Function to get all users
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get("/users");
        console.log("Users fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};      