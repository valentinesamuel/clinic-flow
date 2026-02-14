import { UserRole } from '@/types/user.types';
import {
  PermissionToggles,
  ResourceType,
} from '@/types/permission.types';
import { apiClient } from './client';

export const permissionApi = {
  getToggles: async (): Promise<PermissionToggles> => {
    const { data } = await apiClient.get('/permission-toggles/1');
    const { id, ...toggles } = data;
    return toggles as PermissionToggles;
  },

  setToggle: async (
    key: keyof PermissionToggles,
    value: boolean,
  ): Promise<PermissionToggles> => {
    const { data } = await apiClient.patch('/permission-toggles/1', {
      [key]: value,
    });
    const { id, ...toggles } = data;
    return toggles as PermissionToggles;
  },

  resetToggles: async (): Promise<PermissionToggles> => {
    const defaults: PermissionToggles = {
      hospitalAdminClinicalAccess: false,
      clinicalLeadFinancialAccess: false,
    };
    const { data } = await apiClient.put('/permission-toggles/1', {
      id: '1',
      ...defaults,
    });
    const { id, ...toggles } = data;
    return toggles as PermissionToggles;
  },

  getBasePermissions: async (): Promise<
    Record<UserRole, ResourceType[]>
  > => {
    const { data } = await apiClient.get<{ id: string; resources: ResourceType[] }[]>(
      '/base-permissions',
    );
    const result = {} as Record<UserRole, ResourceType[]>;
    for (const entry of data) {
      result[entry.id as UserRole] = entry.resources;
    }
    return result;
  },
};
