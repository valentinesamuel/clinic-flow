export type EpisodeStatus = 'active' | 'pending_results' | 'follow_up' | 'completed' | 'auto_completed';

export interface Episode {
  id: string;
  episodeNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  status: EpisodeStatus;
  createdAt: string;
  createdBy: string;
  expiresAt: string;
  completedAt?: string;
  autoCompletedReason?: string;
  billIds: string[];
  consultationIds: string[];
  labOrderIds: string[];
  prescriptionIds: string[];
  claimIds: string[];
  provisionalDiagnosis?: string;
  provisionalDiagnosisCode?: string;
  finalDiagnosis?: string;
  finalDiagnosisCode?: string;
  followUpScheduled?: boolean;
  followUpDate?: string;
  followUpUsed?: boolean;
  totalBilled: number;
  totalPaid: number;
  totalBalance: number;
  isLockedForAudit: boolean;
  notes?: string;
}

export interface EpisodeTimelineEvent {
  id: string;
  episodeId: string;
  timestamp: string;
  eventType: 'created' | 'bill_created' | 'consultation' | 'lab_ordered' | 'lab_results' | 'prescription' | 'follow_up' | 'bill_updated' | 'completed' | 'auto_completed';
  description: string;
  actorName: string;
  actorRole: string;
  linkedEntityId?: string;
  linkedEntityType?: string;
}
