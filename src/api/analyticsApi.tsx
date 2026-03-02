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
      params: { service_id, filter } // Axios sẽ tự xóa các giá trị undefined và nối ?a=1&b=2
    });

    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Lỗi lấy dữ liệu analytics:", error);
    return []; 
  }
};

export const getServiceClickSummaryToday = (id?: number | string) => getServiceClickSummary(id, 'today');
export const getServiceClickSummaryWeek = (id?: number | string) => getServiceClickSummary(id, 'week');
export const getServiceClickSummaryMonth = (id?: number | string) => getServiceClickSummary(id, 'month');