import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { reportsApi } from '@/api/reports';

export function useReportSummary() {
  return useQuery({
    queryKey: queryKeys.reports.lists(),
    queryFn: () => reportsApi.getSummary(),
  });
}

export function useReportMetadata() {
  return useQuery({
    queryKey: [...queryKeys.reports.all, 'metadata'],
    queryFn: () => reportsApi.getMetadata(),
  });
}

export function useReportAlerts() {
  return useQuery({
    queryKey: [...queryKeys.reports.all, 'alerts'],
    queryFn: () => reportsApi.getAlerts(),
  });
}
