import { UserRole } from '@/types/user.types';

export interface PermissionToggles {
  hospitalAdminClinicalAccess: boolean;
  clinicalLeadFinancialAccess: boolean;
}

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
