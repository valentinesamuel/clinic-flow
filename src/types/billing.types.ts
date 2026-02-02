// Billing and Financial Type Definitions

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'hmo' | 'corporate';
export type BillStatus = 'pending' | 'partial' | 'paid' | 'waived' | 'refunded';
export type ClaimStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'denied' | 'paid';

export interface BillItem {
  id: string;
  description: string;
  category: 'consultation' | 'procedure' | 'lab' | 'pharmacy' | 'admission' | 'other';
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
