import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { permissionApi } from '@/api/permissions';

export function usePermissionToggles() {
  return useQuery({
    queryKey: queryKeys.permissions.toggles(),
    queryFn: () => permissionApi.getToggles(),
  });
}

export function useBasePermissions() {
  return useQuery({
    queryKey: queryKeys.permissions.base(),
    queryFn: () => permissionApi.getBasePermissions(),
    staleTime: Infinity,
  });
}
