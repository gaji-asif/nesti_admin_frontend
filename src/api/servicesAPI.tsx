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
export type CreateServiceData = Omit<
  Service,
  'id' | 'created_by' | 'updated_at' | 'created_at' | 'image' | 'image_url'
>;

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
export type UpdateServiceData =
  Partial<
    Omit<Service, 'created_by' | 'updated_at' | 'created_at'>
  > & { id: number };

// Function to update a service
export const updateService = async (
  serviceData: UpdateServiceData | FormData
): Promise<Service> => {
  try {
    if (serviceData instanceof FormData) {
      const id = serviceData.get('id');
      if (!id) throw new Error("Missing service ID in FormData");
      if (!serviceData.has('_method')) {
        serviceData.append('_method', 'PATCH');
      }
      const response = await api.post(`/services/${id}`, serviceData);
      console.log("Service updated successfully:", response.data);
      return response.data;
    } 
    
    const { id, ...updateData } = serviceData as UpdateServiceData;
    const response = await api.patch(`/services/${id}`, updateData);
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
    return response.data as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};


// Function to get a single service by ID
// export const getServiceById = async (id: number): Promise<Service> => {
//   try {
//     const response = await api.get(`/services/${id}`);
//     console.log("Service fetched successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching service:", error);
//     throw error;
//   }
// };
