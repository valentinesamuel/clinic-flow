import { apiClient } from './client';

export const appointmentsApi = {
  getAll: async () => (await apiClient.get('/appointments')).data,
};
