// Billing Department Utility Functions

import { UserRole } from '@/types/user.types';
import { BillingDepartment, ServiceCategory } from '@/types/billing.types';

/**
 * Maps user roles to their default billing department
 */
export function getDepartmentForRole(role: UserRole): BillingDepartment {
  const roleToDepartment: Record<UserRole, BillingDepartment> = {
    receptionist: 'front_desk',
    lab_tech: 'lab',
    pharmacist: 'pharmacy',
    nurse: 'nursing',
    doctor: 'all',
    billing: 'all',
    hospital_admin: 'all',
    cmo: 'all',
    clinical_lead: 'all',
    patient: 'all',
  };
  return roleToDepartment[role] || 'all';
}

/**
 * Returns human-readable label for a department
 */
export function getDepartmentLabel(department: BillingDepartment): string {
  const labels: Record<BillingDepartment, string> = {
    front_desk: 'Front Desk',
    lab: 'Laboratory',
    pharmacy: 'Pharmacy',
    nursing: 'Nursing',
    inpatient: 'Inpatient',
    all: 'All Departments',
  };
  return labels[department] || department;
}

/**
 * Checks if a user role can view bills from a specific department
 */
export function canViewDepartment(userRole: UserRole, department: BillingDepartment): boolean {
  // These roles can view all departments
  const allAccessRoles: UserRole[] = ['cmo', 'hospital_admin', 'billing', 'clinical_lead'];
  if (allAccessRoles.includes(userRole)) return true;

  // Department-specific access
  const userDepartment = getDepartmentForRole(userRole);
  return userDepartment === 'all' || userDepartment === department;
}

/**
 * Maps service category to billing department
 */
export function getCategoryToDepartment(category: ServiceCategory): BillingDepartment {
  const categoryToDepartment: Record<ServiceCategory, BillingDepartment> = {
    consultation: 'front_desk',
    lab: 'lab',
    pharmacy: 'pharmacy',
    procedure: 'nursing',
    admission: 'inpatient',
    other: 'front_desk',
  };
  return categoryToDepartment[category];
}

/**
 * Checks if a role can collect payments directly
 */
export function canCollectPayments(userRole: UserRole): boolean {
  const collectRoles: UserRole[] = ['billing', 'receptionist', 'hospital_admin', 'cmo'];
  return collectRoles.includes(userRole);
}

/**
 * Checks if a role can create bills
 */
export function canCreateBills(userRole: UserRole): boolean {
  const createRoles: UserRole[] = ['billing', 'receptionist', 'pharmacist', 'lab_tech', 'nurse', 'hospital_admin', 'cmo'];
  return createRoles.includes(userRole);
}

/**
 * Checks if a role can submit HMO claims
 */
export function canSubmitClaims(userRole: UserRole): boolean {
  const claimRoles: UserRole[] = ['billing', 'hospital_admin', 'cmo'];
  return claimRoles.includes(userRole);
}

/**
 * Generates a unique billing code (8 character alphanumeric)
 */
export function generateBillingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars like 0,O,1,I
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculates billing code expiry (3 days from creation)
 */
export function getBillingCodeExpiry(): string {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 3);
  return expiry.toISOString();
}

/**
 * Checks if a billing code is expired
 */
export function isBillingCodeExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date();
}

/**
 * Get department badge color variant
 */
export function getDepartmentVariant(department: BillingDepartment): 'default' | 'secondary' | 'outline' | 'destructive' {
  const variants: Record<BillingDepartment, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    front_desk: 'default',
    lab: 'secondary',
    pharmacy: 'outline',
    nursing: 'default',
    inpatient: 'secondary',
    all: 'outline',
  };
  return variants[department];
}
