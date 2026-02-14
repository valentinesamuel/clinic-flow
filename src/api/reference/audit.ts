import { apiClient } from '../client';

export const auditApi = {
  getByEntity: async (entityId: string) =>
    (await apiClient.get('/audit-log', { params: { entityId, _sort: 'timestamp', _order: 'desc' } })).data,
  getByPatient: async (patientId: string) =>
    (await apiClient.get('/audit-log', { params: { patientId, _sort: 'timestamp', _order: 'desc' } })).data,
  log: async (entry: Record<string, unknown>) =>
    (await apiClient.post('/audit-log', {
      ...entry,
      timestamp: new Date().toISOString(),
    })).data,
};
