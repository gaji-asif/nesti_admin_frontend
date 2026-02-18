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
    const response = await api.get("/events");  
    return response.data;
  }
    catch (error) {
    console.error("Error fetching events:", error);
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
