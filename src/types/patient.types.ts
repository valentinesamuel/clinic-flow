// Patient-related Type Definitions

export type Gender = 'male' | 'female' | 'other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type PaymentType = 'cash' | 'hmo' | 'corporate';

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface HMODetails {
  providerId: string;
  providerName: string;
  enrollmentId: string;
  planType: string;
  expiryDate: string;
  copayAmount: number;
  isActive: boolean;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  maritalStatus: MaritalStatus;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  state: string;
  lga: string; // Local Government Area
  nationality: string;
  occupation?: string;
  paymentType: PaymentType;
  hmoDetails?: HMODetails;
  nextOfKin: NextOfKin;
  allergies: string[];
  chronicConditions: string[];
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PatientSummary {
  id: string;
  mrn: string;
  fullName: string;
  gender: Gender;
  age: number;
  phone: string;
  paymentType: PaymentType;
  lastVisit?: string;
}

export type QueueType = 'check_in' | 'triage' | 'doctor' | 'pharmacy' | 'lab' | 'billing';
export type QueuePriority = 'normal' | 'high' | 'emergency';
export type QueueStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  queueType: QueueType;
  priority: QueuePriority;
  status: QueueStatus;
  assignedTo?: string; // Staff ID
  reasonForVisit: string;
  checkInTime: string;
  startTime?: string;
  endTime?: string;
  queueNumber: number;
  notes?: string;
}

// Nigerian Location Types
export interface StateOption {
  value: string;
  label: string;
}

export interface LGAOption {
  value: string;
  label: string;
}

// Queue Input and Stats Types
export interface QueueInput {
  patientId: string;
  patientName: string;
  patientMrn: string;
  queueType: QueueType;
  priority?: QueuePriority;
  reasonForVisit: string;
  assignedTo?: string;
  notes?: string;
}

export interface QueueStats {
  waiting: number;
  inProgress: number;
  completed: number;
  avgWaitTime: number;
  emergencyCount: number;
}
