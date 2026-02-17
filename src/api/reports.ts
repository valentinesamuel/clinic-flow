import { apiClient } from './client';
import type { DashboardType, DashboardMetadata, ReportSummary, ReportAlert } from '@/types/report.types';

interface AlertWithDashboard extends ReportAlert {
  dashboardType: DashboardType;
}

export const reportsApi = {
  getSummary: async (): Promise<ReportSummary> => {
    const { data } = await apiClient.get('/report-summary/1');
    const { id, ...summary } = data;
    return summary as ReportSummary;
  },
  getMetadata: async (): Promise<Record<DashboardType, DashboardMetadata>> => {
    const { data } = await apiClient.get<{ id: string; title: string; description: string; metrics: string[] }[]>(
      '/report-metadata',
    );
    const result = {} as Record<DashboardType, DashboardMetadata>;
    for (const entry of data) {
      result[entry.id as DashboardType] = {
        title: entry.title,
        description: entry.description,
        metrics: entry.metrics,
      };
    }
    return result;
  },
  getAlerts: async (): Promise<Record<DashboardType, ReportAlert[]>> => {
    const { data } = await apiClient.get<AlertWithDashboard[]>('/report-alerts');
    const result = {} as Record<DashboardType, ReportAlert[]>;
    for (const alert of data) {
      const type: DashboardType = alert.dashboardType;
      if (!result[type]) result[type] = [];
      result[type].push(alert);
    }
    return result;
  },
};
