import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { authApi } from '@/api/auth';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: !!authApi.getToken(),
  });
}
