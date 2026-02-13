// Billing and Financial Type Definitions

import { UserRole } from './user.types';

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'hmo' | 'corporate';
export type BillStatus = 'pending' | 'partial' | 'paid' | 'waived' | 'refunded';
export type ClaimStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'denied' | 'paid' | 'withdrawn' | 'retracted';
export type ServiceCategory = 'consultation' | 'lab' | 'pharmacy' | 'procedure' | 'admission' | 'other';
export type WithdrawalReason = 'patient_self_pay' | 'hospital_cancelled' | 'claim_error' | 'treatment_changed';
export type BillingDepartment = 'front_desk' | 'lab' | 'pharmacy' | 'nursing' | 'inpatient' | 'all';
export type HMOCoverageType = 'full' | 'partial_percent' | 'partial_flat' | 'none';
export type HMOItemStatus = 'covered' | 'partial' | 'not_covered' | 'opted_out';

export interface HMOServiceCoverage {
  id: string;
  hmoProviderId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  coverageType: HMOCoverageType;
  coveragePercentage?: number;
  coverageFlatAmount?: number;
  maxCoveredAmount?: number;
  requiresPreAuth: boolean;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface PaymentSplit {
  id: string;
  method: PaymentMethod;
  amount: number;
  referenceNumber?: string;
  bank?: string;
  hmoProviderId?: string;
  notes?: string;
}

// Diagnosis codes for claims (ICD-10)
export interface ClaimDiagnosis {
  code: string;
  description: string;
  isPrimary: boolean;
}

export interface BillItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  hmoStatus?: HMOItemStatus;
  hmoCoveredAmount?: number;
  patientLiabilityAmount?: number;
  hmoServiceCoverageId?: string;
  isOptedOutOfHMO?: boolean;
}

export interface Bill {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  visitId: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: BillStatus;
  paymentMethod?: PaymentMethod;
  hmoClaimId?: string;
  createdAt: string;
  createdBy: string;
  createdByRole?: UserRole;
  department: BillingDepartment;
  billingCode?: string;
  billingCodeExpiry?: string;
  paidAt?: string;
  notes?: string;
  episodeId?: string;
  isWalkIn?: boolean;
  walkInCustomerName?: string;
  walkInPhone?: string;
  hmoTotalCoverage?: number;
  patientTotalLiability?: number;
  paymentSplits?: PaymentSplit[];
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  receivedBy: string;
  receivedAt: string;
  notes?: string;
}

export interface ClaimVersion {
  version: number;
  status: ClaimStatus;
  changedAt: string;
  changedBy: string;
  changedByName?: string;
  notes?: string;
  previousValues?: Partial<HMOClaim>;
}

export interface ClaimDocument {
  id: string;
  name: string;
  type: 'auto' | 'manual' | 'generated';
  source?: string; // consultation_id, lab_order_id, etc.
  uploadedAt: string;
  url?: string;
  size?: number;
  mimeType?: string;
}

export interface ClaimItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  claimedAmount: number;
  isExcluded: boolean;
  clinicalNotes?: string;
  clinicalJustification?: string;
  isOffProtocol?: boolean;
}

export interface HMOClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  hmoProviderId: string;
  hmoProviderName: string;
  enrollmentId: string;
  policyNumber?: string;
  preAuthCode?: string;
  billIds: string[];
  items?: ClaimItem[];
  diagnoses?: ClaimDiagnosis[];
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  submittedAt?: string;
  processedAt?: string;
  denialReason?: string;
  resubmissionNotes?: string;
  documents: ClaimDocument[];
  versions: ClaimVersion[];
  currentVersion: number;
  createdAt: string;
  createdBy: string;
  // Withdrawal/Retraction fields
  withdrawnAt?: string;
  withdrawnReason?: WithdrawalReason;
  retractionNotes?: string;
  privateBillId?: string;
  privatePaymentId?: string;
}

export interface HMOProvider {
  id: string;
  name: string;
  code: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  defaultCopay: number;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'medicine' | 'consumable' | 'equipment' | 'utility';
  unit: string;
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  supplier?: string;
  expiryDate?: string;
  location: string;
  lastRestocked?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingBills: number;
  pendingClaims: number;
  cashCollected: number;
  hmoReceivables: number;
  period: string;
}

// Payment Collection Types
export interface PaymentItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  subItems?: PaymentItem[];
}

export interface PaymentClearance {
  id: string;
  receiptNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  items: PaymentItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  bank?: string;
  hmoProviderId?: string;
  hmoPreAuthCode?: string;
  hmoCoverage?: number;
  patientLiability?: number;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  receiptUrl?: string;
  paymentSplits?: PaymentSplit[];
}

export interface HMOVerification {
  id: string;
  providerId: string;
  providerName: string;
  policyNumber: string;
  enrollmentId: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  expiryDate: string;
  coveredServices: ServiceCategory[];
  coPayPercentage: number; // For pharmacy (typically 10%)
  preAuthCode?: string;
  verifiedAt: string;
  errorMessage?: string;
}

export interface NigerianBank {
  id: string;
  name: string;
  code: string;
}
