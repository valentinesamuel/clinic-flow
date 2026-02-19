import { PermissionToggles, ResourceType } from "@/types/permission.types";
import { apiClient } from "./client";
import { TUserRole } from "./clients/auth/authClient.types";

export const permissionApi = {
  getToggles: async (): Promise<PermissionToggles> => {
    const { data } = await apiClient.get("/permission-toggles/1");
    const { id, ...toggles } = data;
    return toggles as PermissionToggles;
  },

  setToggle: async (
    key: keyof PermissionToggles,
    value: boolean,
  ): Promise<PermissionToggles> => {
    const { data } = await apiClient.patch("/permission-toggles/1", {
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
    const { data } = await apiClient.put("/permission-toggles/1", {
      id: "1",
      ...defaults,
    });
    const { id, ...toggles } = data;
    return toggles as PermissionToggles;
  },

  getBasePermissions: async (): Promise<Record<TUserRole, ResourceType[]>> => {
    const { data } =
      await apiClient.get<{ id: string; resources: ResourceType[] }[]>(
        "/base-permissions",
      );
    const result = {} as Record<TUserRole, ResourceType[]>;
    for (const entry of data) {
      result[entry.id as TUserRole] = entry.resources;
    }
    return result;
  },
};
