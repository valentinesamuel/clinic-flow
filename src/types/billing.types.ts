// Billing and Financial Type Definitions

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'hmo' | 'corporate';
export type BillStatus = 'pending' | 'partial' | 'paid' | 'waived' | 'refunded';
export type ClaimStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'denied' | 'paid';
export type ServiceCategory = 'consultation' | 'lab' | 'pharmacy' | 'procedure' | 'admission' | 'other';

export interface BillItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
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
  paidAt?: string;
  notes?: string;
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

export interface HMOClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  hmoProviderId: string;
  hmoProviderName: string;
  enrollmentId: string;
  billId: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  submittedAt?: string;
  processedAt?: string;
  denialReason?: string;
  documents: string[];
  createdAt: string;
  createdBy: string;
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
