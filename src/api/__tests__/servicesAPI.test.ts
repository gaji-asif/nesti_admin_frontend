import { describe, it, expect, vi, type Mock } from 'vitest';
import { addService } from '../servicesAPI';
import { api } from '../config';

vi.mock('../config', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('addService', () => {
  it('should successfully add a service', async () => {
    const mockServiceData = {
      name: 'Test Service',
      category_id: 1,
      location: 'Test Location',
      city: 'Test City',
      address: 'Test Address',
      short_description: 'Test Description',
    };
    const mockResponse = { data: { id: 1, ...mockServiceData } };
    (api.post as Mock).mockResolvedValue(mockResponse);

    const result = await addService(mockServiceData);
    expect(result).toEqual(mockResponse.data);
    expect(api.post).toHaveBeenCalledWith('/add-service', mockServiceData);
  });

  it('should handle API errors', async () => {
    const mockServiceData = {
      name: 'Test Service',
      category_id: 1,
      location: 'Test Location',
      city: 'Test City',
      address: 'Test Address',
      short_description: 'Test Description',
    };
    const mockError = new Error('Network Error');
    (api.post as Mock).mockRejectedValue(mockError);

    await expect(addService(mockServiceData)).rejects.toThrow('Network Error');
  });
});