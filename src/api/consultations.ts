import { apiClient } from './client';

export const consultationsApi = {
  getAll: async () => (await apiClient.get('/consultations')).data,
  getByPatient: async (patientId: string) =>
    (await apiClient.get('/consultations', { params: { patientId } })).data,
  getById: async (id: string) =>
    (await apiClient.get(`/consultations/${id}`)).data,
  getByDoctor: async (doctorId: string) =>
    (await apiClient.get('/consultations', { params: { doctorId } })).data,
  create: async (data: Record<string, unknown>) =>
    (await apiClient.post('/consultations', {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })).data,
  update: async (id: string, updates: Record<string, unknown>) =>
    (await apiClient.patch(`/consultations/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })).data,
};
