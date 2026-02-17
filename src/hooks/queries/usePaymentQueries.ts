import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { paymentsApi } from '@/api/payments';

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments.lists(),
    queryFn: () => paymentsApi.getAll(),
  });
}

export function usePaymentsPaginated(page: number, limit: number, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.payments.list({ page, limit, ...filters }),
    queryFn: () => paymentsApi.getPaginated(page, limit, filters),
  });
}
