import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { claimsApi } from '@/api/claims';

export function useClaims(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.claims.list(filters || {}),
    queryFn: () => claimsApi.getAll(),
  });
}

export function useClaimsPaginated(page: number, limit: number, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.claims.list({ page, limit, ...filters }),
    queryFn: () => claimsApi.getPaginated(page, limit, filters),
  });
}

export function useClaim(id: string) {
  return useQuery({
    queryKey: queryKeys.claims.detail(id),
    queryFn: () => claimsApi.getById(id),
    enabled: !!id,
  });
}

export function usePendingClaims() {
  return useQuery({
    queryKey: [...queryKeys.claims.all, 'pending'],
    queryFn: () => claimsApi.getPending(),
  });
}

export function useHMOProviders() {
  return useQuery({
    queryKey: [...queryKeys.claims.all, 'providers'],
    queryFn: () => claimsApi.getProviders(),
  });
}
