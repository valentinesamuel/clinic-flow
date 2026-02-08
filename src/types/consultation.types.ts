import { LabPriority } from './clinical.types';

export type ConsultationStatus = 'draft' | 'in_progress' | 'finalized';

export type PayerAuthorizationStatus = 'not_required' | 'pending' | 'authorized' | 'denied';

export interface OrderMetadata {
  linked_diagnosis: string;
  is_from_bundle: boolean;
  justification_provided: string;
  payer_authorized: PayerAuthorizationStatus;
  original_price_at_order: number;
}

export interface BundleDeselectionRecord {
  bundleId: string;
  bundleName: string;
  deselectedLabTestCodes: string[];
  deselectedDrugNames: string[];
  timestamp: string;
  doctorId: string;
}

export type JustificationTrigger = 'high_value' | 'conflict';

export interface JustificationEntry {
  triggerId: string;
  triggerType: JustificationTrigger;
  triggerDescription: string;
  justificationText: string;
  itemId: string;
  itemName: string;
  timestamp: string;
}

export type AmendmentReason = 'typo' | 'new_clinical_data' | 'hmo_rejection_fix' | 'other';

export interface ConsultationVersion {
  version: number;
  amendedAt: string;
  amendedBy: string;
  amendedByName: string;
  reason: AmendmentReason;
  reasonDetail?: string;
  snapshot: ConsultationFormData;
}

export type HMORuleField =
  | 'temperature'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'pulse'
  | 'oxygenSaturation'
  | 'labOrder'
  | 'prescription';

export interface HMORule {
  id: string;
  hmoProviderId: string;
  hmoProviderName: string;
  ruleField: HMORuleField;
  condition: 'gte' | 'lte' | 'eq' | 'present';
  value: number | string;
  icdCodesApplicable: string[];
  message: string;
  severity: 'warning' | 'error';
}

export interface ConsultationDiagnosis {
  code: string;
  description: string;
  isPrimary: boolean;
}

export interface ConsultationPrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  metadata?: Partial<OrderMetadata>;
}

export interface ConsultationLabOrder {
  id: string;
  testCode: string;
  testName: string;
  priority: LabPriority;
  notes: string;
  metadata?: Partial<OrderMetadata>;
}

export interface ConsultationFormData {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  selectedDiagnoses: ConsultationDiagnosis[];
  treatmentPlan: string;
  prescriptionItems: ConsultationPrescriptionItem[];
  labOrders: ConsultationLabOrder[];
  followUpDate: string | null;
  notes: string;
  bundleDeselections: BundleDeselectionRecord[];
  justifications: JustificationEntry[];
}
