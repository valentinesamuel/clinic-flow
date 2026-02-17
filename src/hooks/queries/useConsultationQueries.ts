import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { consultationsApi } from '@/api/consultations';

export function useConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.lists(),
    queryFn: () => consultationsApi.getAll(),
  });
}

export function useConsultation(id: string) {
  return useQuery({
    queryKey: queryKeys.consultations.detail(id),
    queryFn: () => consultationsApi.getById(id),
    enabled: !!id,
  });
}

export function useConsultationsByPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.consultations.list({ patientId }),
    queryFn: () => consultationsApi.getByPatient(patientId),
    enabled: !!patientId,
  });
}
