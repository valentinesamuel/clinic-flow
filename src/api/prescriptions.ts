import { apiClient } from './client';

export const prescriptionsApi = {
  getAll: async () => (await apiClient.get('/prescriptions')).data,
  getPending: async () =>
    (await apiClient.get('/prescriptions', { params: { status: 'pending' } })).data,
  getByPatient: async (patientId: string) =>
    (await apiClient.get('/prescriptions', { params: { patientId } })).data,
  getByDoctor: async (doctorId: string) =>
    (await apiClient.get('/prescriptions', { params: { doctorId } })).data,
  getTodays: async () => {
    const today = new Date().toISOString().split('T')[0];
    return (await apiClient.get('/prescriptions', {
      params: { createdAt_gte: today },
    })).data;
  },
  getById: async (id: string) =>
    (await apiClient.get(`/prescriptions/${id}`)).data,
  create: async (data: Record<string, unknown>) =>
    (await apiClient.post('/prescriptions', data)).data,
  dispense: async (id: string, dispensingData: Record<string, unknown>) =>
    (await apiClient.patch(`/prescriptions/${id}`, {
      status: 'dispensed',
      dispensedAt: new Date().toISOString(),
      ...dispensingData,
    })).data,
};
