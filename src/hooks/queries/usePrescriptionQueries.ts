import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { prescriptionsApi } from '@/api/prescriptions';

export function usePrescriptions() {
  return useQuery({
    queryKey: queryKeys.prescriptions.lists(),
    queryFn: () => prescriptionsApi.getAll(),
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: queryKeys.prescriptions.detail(id),
    queryFn: () => prescriptionsApi.getById(id),
    enabled: !!id,
  });
}

export function usePendingPrescriptions() {
  return useQuery({
    queryKey: [...queryKeys.prescriptions.all, 'pending'],
    queryFn: () => prescriptionsApi.getPending(),
  });
}

export function usePrescriptionsByPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.prescriptions.list({ patientId }),
    queryFn: () => prescriptionsApi.getByPatient(patientId),
    enabled: !!patientId,
  });
}
