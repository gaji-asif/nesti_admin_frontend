// Helpers to normalize API responses which may be wrapped or shaped differently

export function normalizeServiceResponse(data: any): any | any[] | null {
  if (data === undefined || data === null) return null;

  // Axios-like wrapper: response.data
  let payload = data;
  if (payload && payload.data !== undefined) payload = payload.data;

  // Some APIs wrap the object under `service`
  if (payload && payload.service !== undefined) payload = payload.service;

  // If it's an array already, return as-is
  if (Array.isArray(payload)) return payload;

  // If payload looks like a service object, return it; otherwise null
  if (payload && (payload.id !== undefined || payload.name !== undefined)) return payload;

  return null;
}

export function normalizeListResponse<T = any>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (data.data && Array.isArray(data.data)) return data.data as T[];
  if (data.services && Array.isArray(data.services)) return data.services as T[];
  return [];
}

// Event-specific normalizer: maps backend event object to frontend EventItem shape
export function normalizeEventItem(e: any) {
  if (!e) return null;
  return {
    id: e.id?.toString() ?? "",
    title: e.name ?? "—",
    description: e.description ?? "",
    short_description: e.short_description ?? "",
    date: e.start_time?.slice(0, 10) ?? "",
    time: e.start_time && e.end_time
      ? `${e.start_time.slice(11,16)}–${e.end_time.slice(11,16)}`
      : e.start_time?.slice(11,16) ?? "",
    city: e.location_extra_info ?? "Helsinki",
    place: e.location ?? "",
    ageGroup: e.audience_min_age || e.audience_max_age
      ? `${e.audience_min_age ?? ""}–${e.audience_max_age ?? ""}`
      : "Kaikille",
    attendeesCount: 0,
    organizer: e.organizer ?? "Tuntematon",
    createdByUserId: e.created_by_user_id ?? "",
    createdAt: e.created_at ?? "",
    lat: e.lat ?? undefined,
    lng: e.lng ?? undefined,
    notice: e.notice ?? "",
    recurring: e.recurring ?? "",
    publisher_name: e.publisher_name ?? "",
    price: e.price ?? "Maksuton",
  };
}
