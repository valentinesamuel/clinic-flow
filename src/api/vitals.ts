import { apiClient } from './client';
import { VitalSigns } from '@/types/clinical.types';

export const vitalsApi = {
  getAll: async () => (await apiClient.get('/vitals')).data,

  getByPatient: async (patientId: string): Promise<VitalSigns[]> => {
    const response = await apiClient.get('/vitals', {
      params: { patientId },
    });
    return response.data;
  },

  getLatest: async (patientId: string): Promise<VitalSigns | null> => {
    const vitals = await vitalsApi.getByPatient(patientId);
    if (vitals.length === 0) return null;

    // Sort by recordedAt descending and return the first one
    const sorted = vitals.sort((a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
    return sorted[0];
  },
};
