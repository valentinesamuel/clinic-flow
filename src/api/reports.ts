import { apiClient } from './client';
import type { DashboardType } from '@/data/reports';

export const reportsApi = {
  getSummary: async () => {
    const { data } = await apiClient.get('/report-summary/1');
    const { id, ...summary } = data;
    return summary;
  },
  getMetadata: async () => {
    const { data } = await apiClient.get<{ id: string; title: string; description: string; metrics: string[] }[]>(
      '/report-metadata',
    );
    const result = {} as Record<DashboardType, { title: string; description: string; metrics: string[] }>;
    for (const entry of data) {
      result[entry.id as DashboardType] = {
        title: entry.title,
        description: entry.description,
        metrics: entry.metrics,
      };
    }
    return result;
  },
  getAlerts: async () => {
    const { data } = await apiClient.get<any[]>('/report-alerts');
    const result = {} as Record<DashboardType, any[]>;
    for (const alert of data) {
      const type = alert.dashboardType as DashboardType;
      if (!result[type]) result[type] = [];
      result[type].push(alert);
    }
    return result;
  },
};
