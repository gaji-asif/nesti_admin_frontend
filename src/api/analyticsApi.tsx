import { api } from "./config";

export interface ServiceClickSummary {
  service_name: string;
  advantage_clicks: number;
  website_visit_clicks: number;
}

export type AnalyticsFilter = 'today' | 'week' | 'month';

export const getServiceClickSummary = async (service_id?: number | string, filter?: AnalyticsFilter): Promise<ServiceClickSummary[]> => {
  try {
    const response = await api.get("/analytics/service-click-summary", {
      params: { service_id, filter } // Axios will automatically remove undefined values and join params as ?a=1&b=2
    });

    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return []; 
  }
};

export const getServiceClickSummaryToday = (id?: number | string) => getServiceClickSummary(id, 'today');
export const getServiceClickSummaryWeek = (id?: number | string) => getServiceClickSummary(id, 'week');
export const getServiceClickSummaryMonth = (id?: number | string) => getServiceClickSummary(id, 'month');