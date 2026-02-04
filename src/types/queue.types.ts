// Queue Management Type Definitions

import { Patient } from './patient.types';

export type QueueType = 
  | 'triage'        // Nurse triage queue
  | 'doctor_new'    // New consultations
  | 'doctor_review' // Result reviews (paused consultations)
  | 'lab'           // Lab sample collection
  | 'pharmacy';     // Pharmacy dispensing

export type QueueStatus =
  | 'waiting'       // In queue
  | 'in_progress'   // Being attended to
  | 'paused'        // Consultation paused
  | 'completed'     // Done
  | 'cancelled'     // Cancelled
  | 'no_show';      // Marked as no-show

export type QueuePriority = 'normal' | 'high' | 'emergency';

export type PaymentClearanceStatus = 
  | 'pending'
  | 'cleared'
  | 'hmo_verified'
  | 'emergency_override';

export type PauseReason =
  | 'waiting_lab_results'
  | 'personal_urgent_issue'
  | 'patient_requested'
  | 'waiting_specialist'
  | 'other';

export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  queueType: QueueType;
  status: QueueStatus;
  priority: QueuePriority;
  
  // Timestamps
  joinedAt: string;
  calledAt?: string;
  completedAt?: string;
  
  // Wait time (calculated)
  waitTimeMinutes: number;
  
  // Payment verification
  paymentStatus: PaymentClearanceStatus;
  paymentClearanceId?: string;
  paymentVerifiedBy?: string;
  paymentVerifiedAt?: string;
  
  // Review-specific
  isReview?: boolean;              // True if returning for results
  originalConsultationId?: string; // Link to paused consultation
  
  // Pause-specific
  pauseReason?: PauseReason;
  pauseReasonOther?: string;       // If reason = 'other'
  pausedAt?: string;
  pausedBy?: string;               // Doctor who paused
  autoPauseExpiryAt?: string;      // 12 hours from pause
  
  // Assignment
  assignedTo?: string;             // Nurse/Doctor/Lab Tech/Pharmacist ID
  assignedToName?: string;
  assignedAt?: string;
  
  // Chief complaint (for doctor queue)
  chiefComplaint?: string;
  
  // Notes
  notes?: string;
  
  // Queue number for display
  queueNumber: number;
}

export interface QueueStats {
  total: number;
  waiting: number;
  inProgress: number;
  paused: number;
  completed: number;
  averageWaitTime: number;
  longestWaitTime: number;
  emergencyCount: number;
}

export interface QueueFilters {
  priority?: QueuePriority | 'all';
  paymentStatus?: PaymentClearanceStatus | 'all';
  waitTime?: 'under_20' | '20_to_40' | 'over_40' | 'all';
  pauseReason?: PauseReason | 'all';
}

export type QueueSortOption = 
  | 'waitTime'
  | 'priority'
  | 'joinedAt'
  | 'pausedAt'
  | 'queueNumber';

export interface QueueConfig {
  name: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'teal' | 'orange';
  allowedRoles: string[];
  requiresPayment: boolean;
  maxWaitTimeWarning: number; // minutes
  columns: string[];
  sortOptions: QueueSortOption[];
  filterOptions: (keyof QueueFilters)[];
  showWarningThreshold?: number;
}

// Queue configuration for each queue type
export const QUEUE_CONFIGS: Record<QueueType, QueueConfig> = {
  triage: {
    name: 'Triage Queue',
    icon: 'Stethoscope',
    color: 'blue',
    allowedRoles: ['nurse', 'clinical_lead', 'cmo', 'hospital_admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 30,
    columns: ['patient', 'priority', 'waitTime', 'paymentStatus', 'actions'],
    sortOptions: ['waitTime', 'priority', 'joinedAt'],
    filterOptions: ['priority', 'paymentStatus', 'waitTime'],
  },
  doctor_new: {
    name: 'New Consultations',
    icon: 'UserRound',
    color: 'green',
    allowedRoles: ['doctor', 'clinical_lead', 'cmo', 'hospital_admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 45,
    columns: ['patient', 'chiefComplaint', 'priority', 'waitTime', 'actions'],
    sortOptions: ['waitTime', 'priority', 'joinedAt'],
    filterOptions: ['priority', 'waitTime'],
  },
  doctor_review: {
    name: 'Result Reviews',
    icon: 'ClipboardCheck',
    color: 'purple',
    allowedRoles: ['doctor', 'clinical_lead', 'cmo'],
    requiresPayment: false,
    maxWaitTimeWarning: 20,
    columns: ['patient', 'pauseReason', 'pausedAt', 'waitTime', 'actions'],
    sortOptions: ['pausedAt', 'waitTime'],
    filterOptions: ['pauseReason'],
    showWarningThreshold: 3,
  },
  lab: {
    name: 'Lab Queue',
    icon: 'FlaskConical',
    color: 'teal',
    allowedRoles: ['lab_tech', 'clinical_lead', 'cmo', 'hospital_admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 60,
    columns: ['patient', 'tests', 'priority', 'waitTime', 'paymentStatus', 'actions'],
    sortOptions: ['priority', 'waitTime', 'joinedAt'],
    filterOptions: ['priority', 'paymentStatus'],
  },
  pharmacy: {
    name: 'Pharmacy Queue',
    icon: 'Pill',
    color: 'orange',
    allowedRoles: ['pharmacist', 'clinical_lead', 'cmo', 'hospital_admin'],
    requiresPayment: false,
    maxWaitTimeWarning: 30,
    columns: ['patient', 'prescriptions', 'waitTime', 'actions'],
    sortOptions: ['waitTime', 'joinedAt'],
    filterOptions: [],
  },
};

// Pause reason display labels
export const PAUSE_REASON_LABELS: Record<PauseReason, string> = {
  waiting_lab_results: 'Waiting for lab results',
  personal_urgent_issue: 'Personal urgent issue',
  patient_requested: 'Patient requested',
  waiting_specialist: 'Waiting for specialist',
  other: 'Other',
};
