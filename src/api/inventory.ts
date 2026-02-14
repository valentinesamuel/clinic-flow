import { apiClient } from './client';

export const inventoryApi = {
  getAll: async () => (await apiClient.get('/inventory')).data,
  getStockRequests: async (filters?: Record<string, string>) =>
    (await apiClient.get('/stock-requests', { params: filters })).data,
  getStockRequestById: async (id: string) =>
    (await apiClient.get(`/stock-requests/${id}`)).data,
  getPendingStockRequests: async () =>
    (await apiClient.get('/stock-requests', { params: { status: 'pending' } })).data,
  getUrgentPendingStockRequests: async () =>
    (await apiClient.get('/stock-requests', {
      params: { status: 'pending', urgency: 'critical' },
    })).data,
  createStockRequest: async (data: Record<string, unknown>) =>
    (await apiClient.post('/stock-requests', data)).data,
  updateStockRequestStatus: async (
    id: string,
    status: string,
    notes?: string,
  ) =>
    (await apiClient.patch(`/stock-requests/${id}`, {
      status,
      ...(notes ? { notes } : {}),
    })).data,
};
