import { apiClient } from './client';

export const vitalsApi = {
  getAll: async () => (await apiClient.get('/vitals')).data,
};
