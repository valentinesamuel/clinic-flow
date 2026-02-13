// Mock Lab Referral Data

import { PartnerLab, LabReferral, ReferralDirection, ReferralStatus } from '@/types/lab-referral.types';

export const mockPartnerLabs: PartnerLab[] = [
  {
    id: 'plab-001',
    name: 'PathCare Nigeria',
    code: 'PATHCARE-NG',
    location: 'Lagos',
    status: 'connected',
    lastSyncAt: '2024-02-02T10:30:00Z',
    specializations: ['Histopathology', 'Cytology', 'Molecular Biology'],
    contactPhone: '+234 801 234 5678',
    contactEmail: 'referrals@pathcare.ng',
  },
  {
    id: 'plab-002',
    name: 'Synlab Nigeria',
    code: 'SYNLAB-NG',
    location: 'Abuja',
    status: 'connected',
    lastSyncAt: '2024-02-02T09:15:00Z',
    specializations: ['Clinical Chemistry', 'Immunology', 'Genetics'],
    contactPhone: '+234 802 345 6789',
    contactEmail: 'support@synlab.ng',
  },
  {
    id: 'plab-003',
    name: 'MDS Lancet',
    code: 'MDS-LANCET',
    location: 'Port Harcourt',
    status: 'disconnected',
    specializations: ['Microbiology', 'Hematology'],
    contactPhone: '+234 803 456 7890',
    contactEmail: 'info@mdslancet.ng',
  },
];

export const mockLabReferrals: LabReferral[] = [
  // Outbound - Pending
  {
    id: 'ref-001',
    direction: 'outbound',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    partnerLabId: 'plab-001',
    partnerLabName: 'PathCare Nigeria',
    tests: [
      { testCode: 'BIOPSY', testName: 'Tissue Biopsy - Histopathology' },
    ],
    status: 'pending',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-02-01T14:00:00Z',
    notes: 'Breast tissue biopsy for suspected malignancy',
    priority: 'urgent',
  },
  // Outbound - Sent
  {
    id: 'ref-002',
    direction: 'outbound',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    partnerLabId: 'plab-002',
    partnerLabName: 'Synlab Nigeria',
    tests: [
      { testCode: 'GENETIC', testName: 'Genetic Testing Panel' },
    ],
    status: 'sent',
    trackingNumber: 'TRK-2024-001',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-01-30T10:00:00Z',
    notes: 'Family history of genetic disorders',
    priority: 'routine',
  },
  // Outbound - Completed
  {
    id: 'ref-003',
    direction: 'outbound',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    partnerLabId: 'plab-001',
    partnerLabName: 'PathCare Nigeria',
    tests: [
      {
        testCode: 'PCR',
        testName: 'RT-PCR COVID-19',
        result: 'Negative',
        normalRange: 'Negative',
      },
    ],
    status: 'completed',
    trackingNumber: 'TRK-2024-002',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-01-28T09:00:00Z',
    completedAt: '2024-01-29T16:00:00Z',
    notes: 'Travel requirement',
    priority: 'routine',
  },
  // Outbound - Completed
  {
    id: 'ref-004',
    direction: 'outbound',
    patientId: 'pat-006',
    patientName: 'Oluwafemi Adesanya',
    patientMrn: 'LC-2024-0006',
    partnerLabId: 'plab-002',
    partnerLabName: 'Synlab Nigeria',
    tests: [
      {
        testCode: 'TUMOR',
        testName: 'Tumor Markers Panel',
        result: 'Within normal limits',
        normalRange: 'See individual markers',
      },
    ],
    status: 'completed',
    trackingNumber: 'TRK-2024-003',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-01-25T11:00:00Z',
    completedAt: '2024-01-27T14:00:00Z',
    priority: 'routine',
  },
  // Inbound - Received
  {
    id: 'ref-005',
    direction: 'inbound',
    patientId: 'pat-007',
    patientName: 'Blessing Igwe',
    patientMrn: 'LC-2024-0007',
    partnerLabId: 'plab-002',
    partnerLabName: 'Synlab Nigeria',
    tests: [
      { testCode: 'MRI', testName: 'MRI Brain with Contrast' },
    ],
    status: 'received',
    trackingNumber: 'TRK-IN-2024-001',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-02-01T08:00:00Z',
    receivedAt: '2024-02-01T15:00:00Z',
    notes: 'Referred from partner facility - neurology consult',
    priority: 'urgent',
  },
  // Inbound - Completed
  {
    id: 'ref-006',
    direction: 'inbound',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    partnerLabId: 'plab-001',
    partnerLabName: 'PathCare Nigeria',
    tests: [
      {
        testCode: 'ECHO',
        testName: 'Echocardiogram',
        result: 'Normal cardiac function, EF 60%',
        normalRange: 'EF 55-70%',
      },
    ],
    status: 'completed',
    trackingNumber: 'TRK-IN-2024-002',
    referredBy: 'lab-t-001',
    referredByName: 'Chinedu Okafor',
    referredAt: '2024-01-29T10:00:00Z',
    receivedAt: '2024-01-29T14:00:00Z',
    completedAt: '2024-01-30T11:00:00Z',
    notes: 'Referred from partner - cardiology assessment',
    priority: 'routine',
  },
];

// Helper functions
export const getPartnerLabs = (): PartnerLab[] => mockPartnerLabs;

export const getConnectedPartnerLabs = (): PartnerLab[] =>
  mockPartnerLabs.filter((lab) => lab.status === 'connected');

export const getReferralsByDirection = (direction: ReferralDirection): LabReferral[] =>
  mockLabReferrals.filter((ref) => ref.direction === direction);

export const getReferralById = (id: string): LabReferral | undefined =>
  mockLabReferrals.find((ref) => ref.id === id);

export const createReferral = (
  data: Omit<LabReferral, 'id' | 'referredAt'>
): LabReferral => {
  const referral: LabReferral = {
    ...data,
    id: `ref-${String(mockLabReferrals.length + 1).padStart(3, '0')}`,
    referredAt: new Date().toISOString(),
  };
  mockLabReferrals.push(referral);
  return referral;
};

export const updateReferralStatus = (
  id: string,
  status: ReferralStatus
): LabReferral | undefined => {
  const referral = mockLabReferrals.find((ref) => ref.id === id);
  if (referral) {
    referral.status = status;
    const now = new Date().toISOString();

    // Set timestamps based on status
    if (status === 'received' && !referral.receivedAt) {
      referral.receivedAt = now;
    }
    if (status === 'completed' && !referral.completedAt) {
      referral.completedAt = now;
    }
  }
  return referral;
};
