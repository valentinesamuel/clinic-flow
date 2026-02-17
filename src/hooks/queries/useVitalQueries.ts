import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { vitalsApi } from '@/api/vitals';

export function useVitals() {
  return useQuery({
    queryKey: queryKeys.vitals.lists(),
    queryFn: () => vitalsApi.getAll(),
  });
}

export function useVitalsByPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.vitals.byPatient(patientId),
    queryFn: () => vitalsApi.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useLatestVitals(patientId: string) {
  return useQuery({
    queryKey: [...queryKeys.vitals.byPatient(patientId), 'latest'],
    queryFn: () => vitalsApi.getLatest(patientId),
    enabled: !!patientId,
  });
}
