import { apiClient } from './client';
import { AppointmentInput } from '@/types/clinical.types';

export const appointmentsApi = {
  getAll: async () => (await apiClient.get('/appointments')).data,

  getById: async (id: string) =>
    (await apiClient.get(`/appointments/${id}`)).data,

  getTodaysAppointments: async () => {
    const today = new Date().toISOString().split('T')[0];
    return (await apiClient.get('/appointments', {
      params: { scheduledDate: today }
    })).data;
  },

  getByDoctor: async (doctorId: string) =>
    (await apiClient.get('/appointments', {
      params: { doctorId }
    })).data,

  getByPatient: async (patientId: string) =>
    (await apiClient.get('/appointments', {
      params: { patientId }
    })).data,

  getByDate: async (date: string) =>
    (await apiClient.get('/appointments', {
      params: { scheduledDate: date }
    })).data,

  getByDateRange: async (startDate: string, endDate: string) =>
    (await apiClient.get('/appointments', {
      params: { scheduledDate_gte: startDate, scheduledDate_lte: endDate }
    })).data,

  create: async (data: AppointmentInput) =>
    (await apiClient.post('/appointments', {
      ...data,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
    })).data,

  update: async (id: string, updates: Record<string, unknown>) =>
    (await apiClient.patch(`/appointments/${id}`, updates)).data,

  updateStatus: async (id: string, status: string) =>
    (await apiClient.patch(`/appointments/${id}`, { status })).data,
};
