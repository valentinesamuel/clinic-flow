import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { authApi } from '@/api/auth';
import { UserRole } from '@/types/user.types';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: UserRole) => authApi.login(role),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
