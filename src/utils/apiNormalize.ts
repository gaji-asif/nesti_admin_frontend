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
  const getPublisherName = (obj: any) => {
    if (!obj) return "";
    // Check creator object first (actual API structure)
    if (obj.creator && obj.creator.name) return obj.creator.name;
    if (obj.publisher_name) return obj.publisher_name;
    if (obj.publisherName) return obj.publisherName;
    if (obj.publisher) {
      if (typeof obj.publisher === 'string') return obj.publisher;
      if (obj.publisher.name) return obj.publisher.name;
      if (obj.publisher.full_name) return obj.publisher.full_name;
    }
    if (obj.publisher_name_display) return obj.publisher_name_display;
    if (obj.user && (obj.user.name || obj.user.full_name)) return obj.user.name || obj.user.full_name;
    return "";
  };

  // Extract venue name from full location address
  const extractVenue = (location: string) => {
    if (!location) return "";
    const str = location.toString().trim();
    // If it contains address info, take the first part (venue name)
    if (str.includes(',')) {
      const parts = str.split(',').map(p => p.trim());
      return parts[0] || str;
    }
    return str;
  };

  // Extract city from location or use default
  const extractCity = (location: string, locationExtra: string) => {
    if (locationExtra) return locationExtra;
    if (location && location.includes('Helsinki')) return 'Helsinki';
    return 'Helsinki'; // Default
  };

  return {
    id: e.id?.toString() ?? "",
    title: e.name ?? "—",
    description: e.description ?? "",
    short_description: e.short_description ?? "",
    date: e.start_time ? e.start_time.slice(0, 10) : "",
    time: e.start_time && e.end_time
      ? `${e.start_time.slice(11, 16)}–${e.end_time.slice(11, 16)}`
      : e.start_time ? e.start_time.slice(11, 16) : "",
    city: extractCity(e.location, e.location_extra_info),
    place: extractVenue(e.location ?? ""),
    ageGroup: e.audience_min_age || e.audience_max_age
      ? `${e.audience_min_age ?? ""}–${e.audience_max_age ?? ""}`
      : "Kaikille",
    attendeesCount: 0,
    organizer: getPublisherName(e) ?? "Tuntematon",
    createdByUserId: e.created_by?.toString() ?? "",
    createdAt: e.created_at ?? "",
    lat: e.lat ?? undefined,
    lng: e.lng ?? undefined,
    notice: e.notice ?? "",
    recurring: e.recurring ?? "",
    publisher_name: getPublisherName(e) ?? "",
    price: e.price ?? "Maksuton",
  };
}
