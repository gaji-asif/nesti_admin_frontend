import { api } from './config'
import { normalizeListResponse, normalizeEventItem } from '../utils/apiNormalize'
import { string } from 'zod';

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

export type CreateEventPayload = Pick<EventItem, 'title' | 'description' | 'short_description' | 'date' | 'time' | 'city' | 'place'> & {  audience: string;
};

// Function to get events list
export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const response = await api.get('/all-events');
    
    // Debug raw response when needed
    console.debug('getEvents - raw response:', response?.data);
    
    // Extract list from possible response shapes and map to EventItem
    const eventsArray = normalizeListResponse<unknown>(response.data);
    const normalized: EventItem[] = eventsArray
      .map((e: unknown) => normalizeEventItem(e))
      .filter(Boolean) as EventItem[];

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

export type EditEventPayload = Partial<CreateEventPayload> & {
  start_time?: string;
  end_time?: string;
};

export const editEvent = async (id: string, formPayload: EditEventPayload): Promise<void> => {
  const body = {
    title: formPayload.title,
    description: formPayload.description,
    short_description: formPayload.short_description,
    date: formPayload.date,
    time: formPayload.start_time && formPayload.end_time ? `${formPayload.start_time}–${formPayload.end_time}` : formPayload.start_time,
    city: formPayload.city,
    place: formPayload.place,
    audience: formPayload.audience,
  };

  try {
    await api.patch(`/events/${id}`, body);
    console.log("Event edited successfully (PATCH /events/:id)");
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404 || status === 405) {
      await api.post(`/events/${id}`, { ...body, _method: 'PUT' });
  }  else {
      console.error("Error editing event:", error);
      throw error;
    }
  }
}

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

function getFallbackPublisherName(e: unknown): string {
  if (!e || typeof e !== 'object') return '';
  const obj = e as Record<string, unknown>;
  if (obj.publisher_name) return String(obj.publisher_name);
  if (obj.publisherName) return String(obj.publisherName);
  const pub = obj.publisher;
  if (!pub) return '';
  if (typeof pub === 'string') return pub;
  if (typeof pub === 'object' && pub !== null) {
    const p = pub as Record<string, unknown>;
    if (p.name) return String(p.name);
    if (p.full_name) return String(p.full_name);
  }
  return '';
}
