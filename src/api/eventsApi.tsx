import { api } from './config'

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
    
    // Extract the array from the API response and normalize
    const eventsArray = response.data?.data ?? [];
    const normalized: EventItem[] = eventsArray.map((e: any) => ({
      id: e.id.toString(),
      title: e.name ?? "—",
      description: e.description ?? "",
      short_description: e.short_description ?? "",
      date: e.start_time?.slice(0, 10) ?? "",
      time:
        e.start_time && e.end_time
          ? `${e.start_time.slice(11, 16)}–${e.end_time.slice(11, 16)}`
          : e.start_time?.slice(11, 16) ?? "",
      city: e.location_extra_info ?? "Helsinki",
      place: e.location ?? "",
      ageGroup:
        e.audience_min_age || e.audience_max_age
          ? `${e.audience_min_age ?? ""}–${e.audience_max_age ?? ""}`
          : "Kaikille",
      attendeesCount: 0,
      organizer: e.organizer ?? "Tuntematon",
      createdByUserId: e.created_by_user_id ?? "",
      createdAt: e.created_at ?? "",
      notice: e.notice ?? "",
      recurring: e.recurring ?? "",
      publisher_name: e.publisher_name ?? "",
      price: e.price ?? "Maksuton",
    }));
    
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
