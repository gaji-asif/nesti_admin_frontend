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
  serviceData: UpdateServiceData | FormData
): Promise<Service> => {
  try {
    // If FormData is provided, assume multipart upload
    if (serviceData instanceof FormData) {
      const id = serviceData.get('id') as unknown as string | undefined;
      // If ID is included as field, use it; otherwise expect PATCH endpoint to accept FormData without id
      const url = id ? `/services/${id}` : `/services`;
      // Debug: log FormData entries (show file metadata only)
      try {
        const dbg: Record<string, any> = {};
        for (const [k, v] of (serviceData as FormData).entries()) {
          dbg[k] = v instanceof File ? { name: v.name, size: v.size, type: v.type } : v;
        }
        console.log('updateService - sending FormData to', url, dbg);
      } catch (e) {
        console.warn('updateService - failed to enumerate FormData for debug', e);
      }
      // Many servers (PHP/Laravel) don't parse multipart bodies for PATCH requests.
      // Use POST with _method=PATCH when sending multipart FormData to ensure backend receives fields.
      try {
        if (!(serviceData as FormData).has('_method')) {
          (serviceData as FormData).append('_method', 'PATCH');
        }
      } catch (e) {
        // ignore
      }
      const response = await api.post(url, serviceData);
      console.log("Service updated successfully (FormData):", response.data);
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
    return response.data;
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
