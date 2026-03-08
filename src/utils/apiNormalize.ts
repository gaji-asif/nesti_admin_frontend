// Helpers to normalize API responses which may be wrapped or shaped differently
import { z } from "zod";

const isObject = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v);

// 1. A single unwrap function for all cases
export function unwrapPayload(data: unknown, keys: string[] = ['data', 'service', 'services']): any {
  let p: any = data;
  while (isObject(p)) {
    const key = keys.find(k => k in p);
    if (!key) break;
    p = p[key];
  }
  return p;
}

export function normalizeServiceResponse(data: unknown): Record<string, unknown> | Record<string, unknown>[] | null {
  if (data === undefined || data === null) return null;

  // Axios-like wrapper: response.data
  let payload: unknown = data;
  if (isObject(payload) && 'data' in payload) payload = (payload as Record<string, unknown>).data;

  // Some APIs wrap the object under `service`
  if (isObject(payload) && 'service' in payload) payload = (payload as Record<string, unknown>).service;

  // If it's an array already, return as-is
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];

  // If payload looks like a service object, return it; otherwise null
  if (isObject(payload) && ('id' in payload || 'name' in payload)) return payload as Record<string, unknown>;

  return null;
}

export function normalizeListResponse<T = unknown>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (isObject(data) && 'data' in data && Array.isArray((data as Record<string, unknown>).data)) return (data as Record<string, unknown>).data as unknown as T[];
  if (isObject(data) && 'services' in data && Array.isArray((data as Record<string, unknown>).services)) return (data as Record<string, unknown>).services as unknown as T[];
  return [];
}

// Event-specific normalizer: maps backend event object to frontend EventItem shape
// Use Zod to validate/normalize event payloads
const EventSchema = z.object({
  id: z.coerce.string(),
  name: z.string().default("—"),
  description: z.string().optional().default(""),
  start_time: z.string().optional().default(""),
  end_time: z.string().optional().default(""),
  location: z.string().optional().default(""),
  location_extra_info: z.string().optional().default("Helsinki"),
  publisher_name: z.string().optional().default("Tuntematon"),
  price: z.string().optional().transform(v => v || "Maksuton").default("Maksuton"),
});

export function normalizeEventItem(e: unknown) {
  const payload = unwrapPayload(e);
  const result = EventSchema.safeParse(payload);
  if (!result.success) return null;

  const data = result.data;
  const start = data.start_time;
  const end = data.end_time;

  return {
    id: data.id,
    title: data.name,
    date: start.slice(0, 10),
    time: start && end ? `${start.slice(11, 16)}–${end.slice(11, 16)}` : start.slice(11, 16),
    city: data.location_extra_info,
    place: data.location.split(',')[0].trim(),
    organizer: data.publisher_name,
    price: data.price,
  };
}
