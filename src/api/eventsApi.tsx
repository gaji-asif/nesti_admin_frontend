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
  name: string;
  short_description: string;
  date: string;
  time: string;
  location: string;
  place: string;
  city: string;
  event_for: string;
  is_active?: string; // "1" or "0" for PHP-style backends
}

// Function to get events list
export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const response = await api.get('/all-events');
    
    // Debug raw response when needed
    console.debug('getEvents - raw response:', response?.data);
    
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
    console.log("Create Event Payload:", payload);
    await api.post('/add-event', payload);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
    console.log("Event deleted successfully (DELETE /events/:id)");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const editEvent = async (id: string, formPayload: any): Promise<void> => {
  try {
    // Map frontend form fields to backend API fields
    const body = {
      name: formPayload.title,
      location: `${formPayload.place}, ${formPayload.city}`,
      date: formPayload.date,
      time: formPayload.end_time ? `${formPayload.start_time} - ${formPayload.end_time}` : formPayload.start_time,
      place: formPayload.place,
      city: formPayload.city,
      event_for: formPayload.audience || "",
      short_description: formPayload.short_description || formPayload.description || ""
    };

    console.debug('editEvent - sending body:', body);
    await api.put(`/events/${id}`, body);
    console.log("Event updated successfully (PUT /events/:id)");
  } catch (error: any) {
    // Keep your existing POST fallback logic here...
    const status = error?.response?.status;
    if (status === 405 || status === 404) {
      // Reconstruct body with the same format for fallback
      const body = {
        name: formPayload.title,
        location: `${formPayload.place}, ${formPayload.city}`,
        date: formPayload.date,
        time: formPayload.end_time ? `${formPayload.start_time} - ${formPayload.end_time}` : formPayload.start_time,
        place: formPayload.place,
        city: formPayload.city,
        event_for: formPayload.audience || "",
        short_description: formPayload.short_description || formPayload.description || ""
      };
      await api.post(`/events/${id}`, { ...body, _method: 'PUT' });
      console.log("Event updated successfully via POST fallback (POST /events/:id with _method=PUT)");
    } else {
      console.error("Error updating event:", error);
      throw error;
    }
  }
};

export const getEventById = async (id: string): Promise<EventItem | null> => {
  try {
    const response = await api.get(`/events/${id}`);
    const eventData = response.data?.data ?? response.data;
    
    if (!eventData) return null;

    const normalized: EventItem = {
      id: eventData.id?.toString() ?? "",
      title: eventData.name ?? "—",
      description: eventData.description ?? "",
      short_description: eventData.short_description ?? "",
      date: eventData.start_time?.slice(0, 10) ?? "",
      time:
        eventData.start_time && eventData.end_time
          ? `${eventData.start_time.slice(11, 16)}–${eventData.end_time.slice(11, 16)}`
          : eventData.start_time?.slice(11, 16) ?? "",
      city: eventData.location_extra_info ?? "Helsinki",
      place: eventData.location ?? "",
      ageGroup:
        eventData.audience_min_age || eventData.audience_max_age
          ? `${eventData.audience_min_age ?? ""}–${eventData.audience_max_age ?? ""}`
          : "Kaikille",
      attendeesCount: 0,
      organizer: eventData.organizer ?? getFallbackPublisherName(eventData) ?? "Tuntematon",
      createdByUserId: eventData.created_by_user_id ?? "",
      createdAt: eventData.created_at ?? "",
      lat: eventData.lat ?? undefined,
      lng: eventData.lng ?? undefined,
      notice: eventData.notice ?? "",
      recurring: eventData.recurring ?? "",
      publisher_name: eventData.publisher_name ?? eventData.publisherName ?? (eventData.publisher && (typeof eventData.publisher === 'string' ? eventData.publisher : eventData.publisher.name)) ?? "",
      price: eventData.price ?? "Maksuton",
    };

    return normalized;
  } catch (error) {
    console.error("Error fetching event by id:", error);
    throw error;
  }
};

function getFallbackPublisherName(e: any): any {
  if (!e) return '';
  if (e.publisher_name) return e.publisher_name;
  if (e.publisherName) return e.publisherName;
  if (e.publisher) {
    if (typeof e.publisher === 'string') return e.publisher;
    if (e.publisher.name) return e.publisher.name;
    if (e.publisher.full_name) return e.publisher.full_name;
  }
  return '';
}
