import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { labApi } from '@/api/lab';

export function useLabOrders() {
  return useQuery({
    queryKey: queryKeys.lab.lists(),
    queryFn: () => labApi.getOrders(),
  });
}

export function useLabOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.lab.detail(id),
    queryFn: () => labApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useTestCatalog() {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'catalog'],
    queryFn: () => labApi.getTestCatalog(),
  });
}

export function usePendingLabOrders() {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'pending'],
    queryFn: () => labApi.getPending(),
  });
}

export function useUrgentLabOrders() {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'urgent'],
    queryFn: () => labApi.getUrgent(),
  });
}

export function useLabOrdersByPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.lab.list({ patientId }),
    queryFn: () => labApi.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function usePartnerLabs() {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'partners'],
    queryFn: () => labApi.getPartnerLabs(),
  });
}

export function useLabReferrals(direction: 'in' | 'out') {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'referrals', direction],
    queryFn: () => labApi.getReferralsByDirection(direction),
  });
}

export function useLabResultsForReview() {
  return useQuery({
    queryKey: [...queryKeys.lab.all, 'review'],
    queryFn: () => labApi.getForReview(),
  });
}
