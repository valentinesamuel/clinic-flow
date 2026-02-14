import { apiClient } from './client';

export const claimsApi = {
  getAll: async () => (await apiClient.get('/claims')).data,
  getProviders: async () => (await apiClient.get('/hmo-providers')).data,
  getPending: async () =>
    (await apiClient.get('/claims', { params: { status: 'pending' } })).data,
  getByStatus: async (status: string) =>
    (await apiClient.get('/claims', { params: { status } })).data,
  getByProvider: async (providerId: string) =>
    (await apiClient.get('/claims', { params: { hmoProviderId: providerId } })).data,
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
  ) => {
    const params: Record<string, unknown> = { _page: page, _limit: limit, ...filters };
    const response = await apiClient.get('/claims', { params });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || response.data.length),
      page,
      limit,
    };
  },
  getById: async (id: string) => (await apiClient.get(`/claims/${id}`)).data,
  submit: async (id: string) =>
    (await apiClient.patch(`/claims/${id}`, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    })).data,
  updateStatus: async (id: string, status: string, notes?: string) =>
    (await apiClient.patch(`/claims/${id}`, {
      status,
      ...(notes ? { notes } : {}),
    })).data,
};
