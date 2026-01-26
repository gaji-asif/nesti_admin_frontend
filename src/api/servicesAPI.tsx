import { api } from "./config";

export interface Service {
  id: number;
  name: string;
  category_ids: number[] | null;
  location: string | null;
  city: string;
  rating: number | null;
  address: string;
  website: string | null;
  description: string | null;
  short_description: string;
  created_by: number;
  updated_at: string;
  created_at: string;
  is_partner: string;
  discount?: string;
  discount_text?: string;
  image: string | null;
  image_url: string | null;
}

// Interface for creating a new service
export interface CreateServiceData {
  name: string;
  category_ids: number[];
  location?: string;
  city: string;
  rating?: number | null;
  address: string;
  website?: string;
  description?: string;
  short_description: string;
  is_partner?: string;
  discount?: string;
  discount_text?: string;
}

// Function to add new service
export const addService = async (
  serviceData: FormData | CreateServiceData
): Promise<Service> => {
  try {
    const response = await api.post("/add-service", serviceData);

    console.log("Service added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

// Interface for updating a service
export interface UpdateServiceData {
  id: number;
  name?: string;
  category_ids?: number[];
  location?: string;
  city?: string;
  rating?: number | null;
  address?: string;
  website?: string;
  description?: string;
  short_description?: string;
  is_partner?: string;
  discount?: string;
  discount_text?: string;
}

// Function to update a service
export const updateService = async (
  serviceData: UpdateServiceData
): Promise<Service> => {
  try {
    const { id, ...updateData } = serviceData;
    const response = await api.put(`/services/${id}`, updateData);

    console.log("Service updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

// Function to delete a service
export const deleteService = async (id: number): Promise<void> => {
  try {
    await api.delete(`/services/${id}`);
    console.log("Service deleted successfully");
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Function to get all services
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get("/all-services");
    console.log("Services fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
