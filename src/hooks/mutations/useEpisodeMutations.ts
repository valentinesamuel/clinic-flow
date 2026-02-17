import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { offlineApiClient } from '@/lib/offlineApiClient';

export function useCreateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      offlineApiClient.post('/episodes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.all });
    },
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      offlineApiClient.patch(`/episodes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.all });
    },
  });
}
