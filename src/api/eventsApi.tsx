import { api } from './config'
import { normalizeListResponse, normalizeEventItem } from '../utils/apiNormalize'

export interface EventItem {
  id: string;
  title: string;
  description: string;
  short_description: string;
  date: string;
  time: string;
  city: string;
  place: string;
  ageGroup: string;
  attendeesCount: number;
  organizer: string;
  createdByUserId: string;
  createdAt: string;
  lat?: number;
  lng?: number;
  notice?: string;
  recurring?: string;
  publisher_name: string;
  price: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  city: string;
  place: string;
  audience: string;
  is_active?: string; // "1" or "0" for PHP-style backends
}

// Function to get events list
export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const response = await api.get('/all-events');
    
    // Extract list from possible response shapes and map to EventItem
    const eventsArray = normalizeListResponse<any>(response.data);
    const normalized: EventItem[] = eventsArray.map((e: any) => normalizeEventItem(e)).filter(Boolean) as EventItem[];

    return normalized;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const createEvent = async (
  payload: CreateEventPayload
): Promise<void> => {
  try {
    console.log("Payload:", payload);
    await api.post('/add-event', payload);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/delete-event/${id}`);
    console.log("Event deleted successfully");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const editEvent = async (id: string, payload: Partial<CreateEventPayload>): Promise<void> => {
  try {
    await api.post(`/edit-event/${id}`, payload);
    console.log("Event edited successfully");
  } catch (error) {
    console.error("Error editing event:", error);
    throw error;
  }
};
