import { api } from "./config";

export interface EventCreator {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  event_id?: number | null;
  name: string;
  images?: any | null;
  location: string | null;
  location_extra_info?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  audience_min_age?: number | null;
  audience_max_age?: number | null;
  price?: number | string | null;
  description?: string | null;
  short_description?: string | null;
  headline?: string | null;
  secondary_headline?: string | null;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  event_for?: string | null;
  publisher_name?: string | null;
  event_date_time?: string | null;
  details_url?: string | null;
  created_by?: number | null;
  creator?: EventCreator | null;
  date?: string | null;
}

// Interface for creating a new event
export interface CreateEventData {
  name: string;
  description?: string;
  date: string;
  location?: string;
}   

// Function to add new event
export const addEvent = async (
  eventData: FormData | CreateEventData
): Promise<Event> => {
  try {
    const response = await api.post("/add-event", eventData);

    console.log("Event added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

//Function to get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get("/all-events");
    const respData: any = response.data;

    if (Array.isArray(respData)) return respData as Event[];
    if (respData && Array.isArray(respData.data)) return respData.data as Event[];
    if (respData && Array.isArray(respData.events)) return respData.events as Event[];

    // Fallback: if the response is an object with keys matching Event, wrap it
    return [];
  }
    catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

//Function to edit an event by id
export const editEvent = async (
  eventData: FormData | Event
): Promise<Event> => {  
    try {
        const eventId = eventData instanceof FormData ? eventData.get('id') : eventData.id;
        const response = await api.post(`/edit-event/${eventId}`, eventData);
        console.log("Event edited successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing event:", error);
        throw error;
    }
};

// Function to delete an event by id
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
    console.log("Event deleted successfully");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Normalize an arbitrary event-like JSON into FormData and send via addEvent.
// Accepts variants like { title, start_time, end_time, event_for } and
// converts to the backend-friendly FormData payload used by `addEvent`.
export const processAndAddEvent = async (payload: any): Promise<Event> => {
  const toIso = (s: any) => {
    if (!s) return null;
    // Try parsing as date string; if it fails, try appending 'Z' assuming UTC.
    let d = new Date(s);
    if (isNaN(d.getTime())) {
      d = new Date(String(s) + "Z");
    }
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  const fd = new FormData();

  // Map common alternate keys
  const name = payload.name ?? payload.title ?? payload.event_name ?? "";
  if (name) fd.append("name", String(name));
  if (payload.short_description) fd.append("short_description", String(payload.short_description));
  if (payload.description) fd.append("description", String(payload.description));
  if (payload.location) fd.append("location", String(payload.location));
  if (payload.location_extra_info) fd.append("location_extra_info", String(payload.location_extra_info));
  if (payload.event_for) fd.append("event_for", String(payload.event_for));

  const startIso = toIso(payload.start_time ?? payload.start);
  const endIso = toIso(payload.end_time ?? payload.end);
  if (startIso) fd.append("start_time", startIso);
  if (endIso) fd.append("end_time", endIso);

  // is_active: accept booleans or numeric/strings
  if (typeof payload.is_active !== "undefined") {
    fd.append("is_active", payload.is_active ? "1" : "0");
  } else if (typeof payload.active !== "undefined") {
    fd.append("is_active", payload.active ? "1" : "0");
  } else {
    fd.append("is_active", "1");
  }

  // Ensure array fields to avoid backend undefined index errors
  const ensureArrayField = (fdLocal: FormData, key: string, minCount = 2) => {
    const keys = Array.from(fdLocal.keys());
    const hasArrayKey = keys.some((k) => k === `${key}[]` || k.startsWith(`${key}[`));
    if (!hasArrayKey) {
      for (let i = 0; i < minCount; i++) {
        fdLocal.append(`${key}[]`, "");
        // also add explicit numeric indexes in case server accesses those directly (e.g. images[1])
        fdLocal.append(`${key}[${i}]`, "");
      }
    }
  };
  ensureArrayField(fd, "images", 2);
  ensureArrayField(fd, "category_ids", 2);

  return addEvent(fd);
};
