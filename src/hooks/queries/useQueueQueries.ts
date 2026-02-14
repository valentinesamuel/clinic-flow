import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { queueApi } from '@/api/queue';

export function useQueueByType(type: string) {
  return useQuery({
    queryKey: queryKeys.queues.byType(type),
    queryFn: () => queueApi.getByType(type),
    refetchInterval: 30_000,
  });
}

export function useQueueStats(type: string) {
  return useQuery({
    queryKey: queryKeys.queues.stats(type),
    queryFn: () => queueApi.getStats(type),
    refetchInterval: 30_000,
  });
}

export function useAllQueueStats() {
  return useQuery({
    queryKey: [...queryKeys.queues.all, 'allStats'],
    queryFn: () => queueApi.getAllStats(),
    refetchInterval: 30_000,
  });
}
