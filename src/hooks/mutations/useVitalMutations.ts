import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { offlineApiClient } from '@/lib/offlineApiClient';

export function useCreateVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      offlineApiClient.post('/vitals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vitals.all });
    },
  });
}
