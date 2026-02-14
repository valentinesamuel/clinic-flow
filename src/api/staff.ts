import { apiClient } from './client';

export const staffApi = {
  getAll: async () => (await apiClient.get('/staff')).data,
  getById: async (id: string) => (await apiClient.get(`/staff/${id}`)).data,
  getDoctors: async () =>
    (await apiClient.get('/staff', { params: { role: 'doctor' } })).data,
  getNurses: async () =>
    (await apiClient.get('/staff', { params: { role: 'nurse' } })).data,
  getRoster: async () => (await apiClient.get('/roster')).data,
  getStaffRoster: async (staffId: string) => {
    const { data } = await apiClient.get('/roster', { params: { staffId } });
    return data;
  },
};
