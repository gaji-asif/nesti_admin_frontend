import { api } from "./config";

export interface Review {
  id: number;
  service_id: number;
  user_id: number;
  rating: number;
  review: string | null;
  starts_at: string;
  created_at: string;
  updated_at: string;
}

// Function to get all reviews (admin view)
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get("/reviews");
    console.log("reviews response", response);
    console.log("response.data", response.data);
    const payload = response.data;
    if (Array.isArray(payload)) return payload as Review[];
    if (payload && Array.isArray(payload.data)) return payload.data as Review[];
    if (payload && Array.isArray(payload.reviews)) return payload.reviews as Review[];
    // Fallback: return empty array and log unexpected shape
    console.warn("getAllReviews: unexpected response shape", payload);
    return [] as Review[];
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw error;
  }
};