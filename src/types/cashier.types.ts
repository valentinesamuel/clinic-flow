// Cashier Types for shift management, transactions, and service pricing

import { PaymentMethod, ServiceCategory, BillingDepartment } from './billing.types';
import { UserRole } from './user.types';

export type CashierStation = 'main' | 'lab' | 'pharmacy';
export type ShiftStatus = 'active' | 'closed';
export type PriceApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface CashierShift {
  id: string;
  cashierId: string;
  cashierName: string;
  station: CashierStation;
  startedAt: string;
  endedAt?: string;
  status: ShiftStatus;
  openingBalance: number;
  closingBalance?: number;
  expectedBalance?: number;
  variance?: number;
  transactions: ShiftTransaction[];
  notes?: string;
}

export interface ShiftTransaction {
  id: string;
  receiptNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  amount: number;
  paymentMethod: PaymentMethod;
  billingCode?: string;
  timestamp: string;
}

export interface ServicePrice {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  standardPrice: number;
  hmoPrice?: number;
  isTaxable: boolean;
  isActive: boolean;
  status: PriceApprovalStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  department?: BillingDepartment;
  isPremium?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
}

export interface PriceApproval {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  category: ServiceCategory;
  oldPrice?: number;
  newPrice: number;
  changePercentage?: number;
  reason: string;
  requestedBy: string;
  requestedByName: string;
  requestedByRole: UserRole;
  requestedAt: string;
  status: PriceApprovalStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  isNewService: boolean;
}

export interface EmergencyOverride {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  reason: string;
  scope: 'consultation' | 'consultation_emergency' | 'full_visit';
  estimatedAmount: number;
  authorizedBy: string;
  authorizedByName: string;
  authorizedByRole: UserRole;
  authorizedAt: string;
  status: 'active' | 'cleared' | 'expired';
  clearedAt?: string;
  clearedBy?: string;
  paymentId?: string;
  notes?: string;
}

export interface BillingCodeEntry {
  id: string;
  code: string;
  billId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  department: BillingDepartment;
  amount: number;
  hmoCoverage?: number;
  patientLiability?: number;
  status: 'generated' | 'paid' | 'expired' | 'cancelled';
  generatedBy: string;
  generatedByName: string;
  generatedAt: string;
  expiresAt: string;
  paidAt?: string;
  paidBy?: string;
  receiptNumber?: string;
}
