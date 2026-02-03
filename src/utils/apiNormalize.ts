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
