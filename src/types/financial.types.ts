export type PayerType = 'cash' | 'hmo' | 'corporate';
export type CoverageStatus = 'covered' | 'partial' | 'not_covered';

export interface ResolvedPrice {
  itemId: string;
  itemName: string;
  category: 'lab' | 'pharmacy' | 'procedure' | 'consultation';
  standardPrice: number;
  payerPrice: number;
  coverageStatus: CoverageStatus;
  patientLiability: number;
  hmoLiability: number;
  isPremium?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
}

export interface FinancialSummary {
  labTotal: number;
  pharmacyTotal: number;
  consultationTotal: number;
  grandTotal: number;
  patientTotal: number;
  hmoTotal: number;
  itemCount: number;
}

export interface ProtocolBundle {
  id: string;
  name: string;
  description: string;
  icd10Codes: string[];
  labTests: BundleLabItem[];
  medications: BundleMedItem[];
}

export interface BundleLabItem {
  testCode: string;
  testName: string;
  priority: 'routine' | 'urgent' | 'stat';
  notes?: string;
}

export interface BundleMedItem {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface ICD10ServiceMapping {
  id: string;
  icd10Code: string;
  icd10Description: string;
  approvedServiceIds: string[];
  approvedServiceNames: string[];
  bundleId?: string;
}
