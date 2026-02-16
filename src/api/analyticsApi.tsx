import { api } from "./config";

export interface ServiceClickSummary {
  service_name: string;
  advantage_clicks: number;
  website_visit_clicks: number;
}

// Function to get service click summary analytics
export const getServiceClickSummary = async (): Promise<ServiceClickSummary[]> => {
  try {
    const response = await api.get("/analytics/service-click-summary");

    console.log("Service click summary fetched successfully:", response.data);

    // Handle the API response structure with success/message/data wrapper
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching service click summary:", error);
    throw error;
  }
};