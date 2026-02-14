import { apiClient } from '../client';

export const banksApi = {
  getAll: async () => (await apiClient.get('/nigerian-banks')).data,
  getById: async (id: string) =>
    (await apiClient.get(`/nigerian-banks/${id}`)).data,
  getByCode: async (code: string) => {
    const { data } = await apiClient.get('/nigerian-banks', { params: { code } });
    return data[0] || null;
  },
};
