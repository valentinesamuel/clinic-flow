import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { patientsApi } from '@/api/patients';

export function usePatients(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.patients.list(filters || {}),
    queryFn: () => patientsApi.getPaginated(1, 100, filters),
  });
}

export function usePatientsPaginated(page: number, limit: number, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.patients.list({ page, limit, ...filters }),
    queryFn: () => patientsApi.getPaginated(page, limit, filters),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id),
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
}

export function usePatientSearch(query: string) {
  return useQuery({
    queryKey: [...queryKeys.patients.all, 'search', query],
    queryFn: () => patientsApi.search(query),
    enabled: query.length >= 2,
  });
}
