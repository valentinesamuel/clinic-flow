// usePermissions Hook - Role + toggle based access control

import { useMemo } from 'react';
import { UserRole } from '@/types/user.types';
import { ResourceType, basePermissions } from '@/types/permission.types';
import { usePermissionToggles } from './queries/usePermissionQueries';

interface UsePermissionsProps {
  userRole: UserRole | undefined;
}

export function usePermissions({ userRole }: UsePermissionsProps) {
  const { data: toggles } = usePermissionToggles();

  const permissions = useMemo(() => {
    const safeToggles = toggles ?? {
      hospitalAdminClinicalAccess: false,
      clinicalLeadFinancialAccess: false,
    };

    if (!userRole) {
      return {
        canViewClinicalData: false,
        canViewFinancialData: false,
        canManageStaff: false,
        canManageInventory: false,
        canManageSettings: false,
        canAccess: () => false,
        getAllowedResources: () => [] as ResourceType[],
      };
    }

    // Clinical data access
    const canViewClinicalData = (): boolean => {
      const clinicalRoles: UserRole[] = ['cmo', 'clinical_lead', 'doctor', 'nurse', 'pharmacist', 'lab_tech'];
      if (clinicalRoles.includes(userRole)) return true;
      if (userRole === 'hospital_admin' && safeToggles.hospitalAdminClinicalAccess) return true;
      return false;
    };

    // Financial data access
    const canViewFinancialData = (): boolean => {
      const financialRoles: UserRole[] = ['cmo', 'hospital_admin', 'cashier'];
      if (financialRoles.includes(userRole)) return true;
      if (userRole === 'clinical_lead' && safeToggles.clinicalLeadFinancialAccess) return true;
      return false;
    };

    // Staff management access
    const canManageStaff = (): boolean => {
      const staffManagementRoles: UserRole[] = ['cmo', 'hospital_admin', 'clinical_lead'];
      return staffManagementRoles.includes(userRole);
    };

    // Inventory management access
    const canManageInventory = (): boolean => {
      const inventoryRoles: UserRole[] = ['cmo', 'hospital_admin', 'pharmacist'];
      return inventoryRoles.includes(userRole);
    };

    // System settings access (CMO only)
    const canManageSettings = (): boolean => {
      return userRole === 'cmo';
    };

    // Generic resource access check
    const canAccess = (resource: ResourceType): boolean => {
      // CMO has access to everything
      if (userRole === 'cmo') return true;

      // Check base permissions
      const rolePermissions = basePermissions[userRole] || [];
      if (rolePermissions.includes(resource)) return true;

      // Check toggle-based permissions
      if (userRole === 'hospital_admin' && safeToggles.hospitalAdminClinicalAccess) {
        if (['clinical_records', 'patient_emr'].includes(resource)) return true;
      }
      if (userRole === 'clinical_lead' && safeToggles.clinicalLeadFinancialAccess) {
        if (['financial_reports', 'revenue_data'].includes(resource)) return true;
      }

      return false;
    };

    // Get all resources this role can access
    const getAllowedResources = (): ResourceType[] => {
      const resources = [...(basePermissions[userRole] || [])];

      if (userRole === 'hospital_admin' && safeToggles.hospitalAdminClinicalAccess) {
        resources.push('clinical_records', 'patient_emr');
      }
      if (userRole === 'clinical_lead' && safeToggles.clinicalLeadFinancialAccess) {
        resources.push('financial_reports', 'revenue_data');
      }

      return [...new Set(resources)]; // Remove duplicates
    };

    return {
      canViewClinicalData: canViewClinicalData(),
      canViewFinancialData: canViewFinancialData(),
      canManageStaff: canManageStaff(),
      canManageInventory: canManageInventory(),
      canManageSettings: canManageSettings(),
      canAccess,
      getAllowedResources,
    };
  }, [userRole, toggles]);

  return permissions;
}
