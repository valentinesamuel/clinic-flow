import { apiClient } from './client';

export const patientsApi = {
  getAll: async () => (await apiClient.get('/patients')).data,
  getById: async (id: string) => (await apiClient.get(`/patients/${id}`)).data,
  getByMrn: async (mrn: string) => {
    const { data } = await apiClient.get('/patients', { params: { mrn } });
    return data[0] || null;
  },
  search: async (query: string) =>
    (await apiClient.get('/patients', { params: { q: query } })).data,
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
  ) => {
    const params: Record<string, unknown> = { _page: page, _limit: limit, ...filters };
    const response = await apiClient.get('/patients', { params });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || response.data.length),
      page,
      limit,
    };
  },
  getByPaymentType: async (type: string) =>
    (await apiClient.get('/patients', { params: { paymentType: type } })).data,
  getRecent: async (_days?: number) =>
    (await apiClient.get('/patients', { params: { _sort: 'createdAt', _order: 'desc', _limit: 20 } })).data,
  add: async (data: Record<string, unknown>) =>
    (await apiClient.post('/patients', data)).data,
  update: async (id: string, data: Record<string, unknown>) =>
    (await apiClient.patch(`/patients/${id}`, data)).data,
  delete: async (id: string) => {
    await apiClient.delete(`/patients/${id}`);
    return true;
  },
};
