import { api, ApiResponse } from "./config";

export interface Service {
  id: number;
  name: string;
  category_id: number;
  location: string;
  city: string;
  rating: number | null;
  address: string;
  website: string;
  description: string;
  short_description: string;
  created_by: number;
  updated_at: string;
  created_at: string;
}

// Interface for creating a new service
export interface CreateServiceData {
  name: string;
  category_id: number;
  location: string;
  city: string;
  rating?: number | null;
  address: string;
  website?: string;
  description?: string;
  short_description: string;
}

// Function to add new service
export const addService = async (
  serviceData: CreateServiceData
): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.post("/add-service", serviceData);
    console.log("Response data:", response)
    console.log("Service added successfully:", response.data);
    console.log("Next service Id to be assigned:", response.data.id + 1);
    return response.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};
