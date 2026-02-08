// Permission Context - CMO-controlled access toggles

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { UserRole } from '@/types/user.types';

export interface PermissionToggles {
  hospitalAdminClinicalAccess: boolean;
  clinicalLeadFinancialAccess: boolean;
}

interface PermissionContextType {
  toggles: PermissionToggles;
  setToggle: (key: keyof PermissionToggles, value: boolean) => void;
  resetToggles: () => void;
}

const defaultToggles: PermissionToggles = {
  hospitalAdminClinicalAccess: false,
  clinicalLeadFinancialAccess: false,
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [toggles, setToggles] = useState<PermissionToggles>(defaultToggles);

  const setToggle = useCallback((key: keyof PermissionToggles, value: boolean) => {
    setToggles(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToggles = useCallback(() => {
    setToggles(defaultToggles);
  }, []);

  return (
    <PermissionContext.Provider value={{ toggles, setToggle, resetToggles }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
}

// Resource types for permission checks
export type ResourceType = 
  | 'clinical_records'
  | 'patient_emr'
  | 'financial_reports'
  | 'revenue_data'
  | 'staff_management'
  | 'inventory'
  | 'billing'
  | 'hmo_claims'
  | 'lab_results'
  | 'prescriptions'
  | 'appointments'
  | 'queue_management'
  | 'system_settings';

export type ActionType = 'view' | 'create' | 'edit' | 'delete';

// Define base permissions per role
export const basePermissions: Record<UserRole, ResourceType[]> = {
  cmo: [
    'clinical_records', 'patient_emr', 'financial_reports', 'revenue_data',
    'staff_management', 'inventory', 'billing', 'hmo_claims', 'lab_results',
    'prescriptions', 'appointments', 'queue_management', 'system_settings'
  ],
  hospital_admin: [
    'financial_reports', 'revenue_data', 'staff_management', 'inventory',
    'billing', 'hmo_claims', 'appointments', 'queue_management'
  ],
  clinical_lead: [
    'clinical_records', 'patient_emr', 'staff_management', 'lab_results',
    'prescriptions', 'appointments', 'queue_management'
  ],
  doctor: [
    'clinical_records', 'patient_emr', 'lab_results', 'prescriptions', 'appointments'
  ],
  nurse: [
    'clinical_records', 'patient_emr', 'lab_results', 'queue_management'
  ],
  receptionist: [
    'appointments', 'queue_management'
  ],
  cashier: [
    'billing', 'hmo_claims'
  ],
  pharmacist: [
    'prescriptions', 'inventory'
  ],
  lab_tech: [
    'lab_results'
  ],
  patient: [
    'appointments', 'lab_results', 'prescriptions', 'billing'
  ],
};
