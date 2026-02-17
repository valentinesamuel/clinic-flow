import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { inventoryApi } from '@/api/inventory';

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory.lists(),
    queryFn: () => inventoryApi.getAll(),
  });
}

export function useStockRequests(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'stock-requests', filters],
    queryFn: () => inventoryApi.getStockRequests(filters),
  });
}

export function usePendingStockRequests() {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'stock-requests', 'pending'],
    queryFn: () => inventoryApi.getPendingStockRequests(),
  });
}

export function useUrgentPendingStockRequests() {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'stock-requests', 'urgent'],
    queryFn: () => inventoryApi.getUrgentPendingStockRequests(),
  });
}
