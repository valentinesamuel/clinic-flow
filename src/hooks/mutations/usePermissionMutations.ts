import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { permissionApi } from '@/api/permissions';
import { PermissionToggles } from '@/types/permission.types';

export function useSetPermissionToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: keyof PermissionToggles; value: boolean }) =>
      permissionApi.setToggle(key, value),
    onSuccess: (newToggles) => {
      queryClient.setQueryData(queryKeys.permissions.toggles(), newToggles);
    },
  });
}

export function useResetPermissionToggles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => permissionApi.resetToggles(),
    onSuccess: (newToggles) => {
      queryClient.setQueryData(queryKeys.permissions.toggles(), newToggles);
    },
  });
}
