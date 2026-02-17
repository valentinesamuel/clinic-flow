import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { servicePricingApi } from '@/api/service-pricing';

export function useServicePrices(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.servicePricing.list(filters || {}),
    queryFn: () => servicePricingApi.getAll(filters),
  });
}

export function useServicePricesPaginated(page: number, limit: number, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.servicePricing.list({ page, limit, ...filters }),
    queryFn: () => servicePricingApi.getPaginated(page, limit, filters),
  });
}

export function usePriceApprovals() {
  return useQuery({
    queryKey: [...queryKeys.servicePricing.all, 'approvals'],
    queryFn: () => servicePricingApi.getAllApprovals(),
  });
}

export function usePendingPriceApprovals() {
  return useQuery({
    queryKey: [...queryKeys.servicePricing.all, 'approvals', 'pending'],
    queryFn: () => servicePricingApi.getPendingApprovals(),
  });
}
