// Lab Referral Types

export type PartnerLabStatus = 'connected' | 'disconnected' | 'pending';
export type ReferralDirection = 'outbound' | 'inbound';
export type ReferralStatus = 'pending' | 'sent' | 'in_transit' | 'received' | 'processing' | 'completed' | 'cancelled';

export interface PartnerLab {
  id: string;
  name: string;
  code: string;
  location: string;
  status: PartnerLabStatus;
  lastSyncAt?: string;
  specializations: string[];
  contactPhone: string;
  contactEmail: string;
}

export interface ReferralTest {
  testCode: string;
  testName: string;
  result?: string;
  unit?: string;
  normalRange?: string;
}

export interface LabReferral {
  id: string;
  direction: ReferralDirection;
  patientId: string;
  patientName: string;
  patientMrn: string;
  partnerLabId: string;
  partnerLabName: string;
  tests: ReferralTest[];
  status: ReferralStatus;
  trackingNumber?: string;
  referredBy: string;
  referredByName: string;
  referredAt: string;
  receivedAt?: string;
  completedAt?: string;
  notes?: string;
  priority: 'routine' | 'urgent';
}
