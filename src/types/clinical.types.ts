// Clinical Data Type Definitions

import { OrderMetadata, ConsultationVersion } from './consultation.types';

export interface VitalSigns {
  id: string;
  patientId: string;
  recordedBy: string; // Staff ID
  recordedAt: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number; // Celsius
  pulse: number; // BPM
  respiratoryRate: number;
  oxygenSaturation: number; // Percentage
  weight: number; // kg
  height: number; // cm
  bmi: number;
  notes?: string;
}

export interface VitalAlert {
  field: keyof VitalSigns;
  value: number;
  severity: 'warning' | 'critical';
  message: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'procedure' | 'lab_only';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  reasonForVisit: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export type PrescriptionStatus = 'pending' | 'dispensed' | 'partially_dispensed' | 'cancelled';

export interface PrescriptionItem {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
  metadata?: Partial<OrderMetadata>;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  visitId: string;
  items: PrescriptionItem[];
  status: PrescriptionStatus;
  prescribedAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
  dispensedItems?: DispensedItem[];
  auditLog?: DispenseAuditEntry[];
}

export type LabOrderStatus = 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
export type LabPriority = 'routine' | 'urgent' | 'stat';

export interface LabTest {
  testCode: string;
  testName: string;
  result?: string;
  normalRange?: string;
  unit?: string;
  isAbnormal?: boolean;
  techNotes?: string;
  images?: string[];
  metadata?: Partial<OrderMetadata> & Record<string, string>;
}

export interface TestCatalogEntry {
  testCode: string;
  testName: string;
  category: string;
  defaultUnit: string;
  defaultRange: string;
  criticalLow?: number;
  criticalHigh?: number;
  methodology?: string;
  preparationInstructions?: string;
  sampleType?: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  tests: LabTest[];
  status: LabOrderStatus;
  priority: LabPriority;
  orderedAt: string;
  collectedAt?: string;
  completedAt?: string;
  collectedBy?: string;
  processedBy?: string;
  notes?: string;
  isSubmittedToDoctor?: boolean;
  submittedAt?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  diagnosis: string[];
  icdCodes: string[];
  treatmentPlan: string;
  prescriptionId?: string;
  labOrderIds: string[];
  followUpDate?: string;
  status?: 'draft' | 'in_progress' | 'finalized';
  createdAt: string;
  updatedAt: string;
  versions: ConsultationVersion[];
  currentVersion: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  specialization?: string;
  licenseNumber?: string;
  phone: string;
  email: string;
  shiftStart?: string;
  shiftEnd?: string;
  isOnDuty: boolean;
  photoUrl?: string;
}

export type SubstitutionType = 'generic' | 'therapeutic';

export interface DispensedItem {
  drugName: string;
  dispensedDrugName?: string;
  substitutionType?: SubstitutionType;
  substitutionReason?: string;
  pharmacistNotes?: string;
  prescribedQuantity: number;
  dispensedQuantity: number;
  isSubstituted: boolean;
}

export interface DispenseAuditEntry {
  id: string;
  action: 'dispensed' | 'partially_dispensed' | 'substituted' | 'cancelled';
  prescriptionId: string;
  itemDrugName: string;
  details: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
}
