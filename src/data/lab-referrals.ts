// Mock Lab Referral Data

import { PartnerLab, LabReferral, ReferralDirection, ReferralStatus, ReferralTest } from '@/types/lab-referral.types';
import { LabOrder } from '@/types/clinical.types';
import { mockLabOrders, createLabOrder } from '@/data/lab-orders';

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
    externalReferenceNumber: 'PC-RES-20240129-003',
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
    externalReferenceNumber: 'SYN-RES-20240127-004',
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
    patientPhone: '+234 812 345 6789',
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
    patientPhone: '+234 803 111 2222',
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

// Creates an inbound referral AND a linked LabOrder so it appears in the sample queue.
export const createInboundReferral = (data: {
  patientName: string;
  patientPhone: string;
  partnerLabId: string;
  partnerLabName: string;
  tests: ReferralTest[];
  priority: 'routine' | 'urgent';
  notes?: string;
  attachments?: string[];
  referredBy: string;
  referredByName: string;
}): { referral: LabReferral; labOrder: LabOrder } => {
  const patientMrn = `INB-${data.patientPhone.replace(/\D/g, '').slice(-10)}`;

  const referral = createReferral({
    direction: 'inbound',
    patientId: `pat-inb-${Date.now()}`,
    patientName: data.patientName,
    patientMrn,
    partnerLabId: data.partnerLabId,
    partnerLabName: data.partnerLabName,
    tests: data.tests,
    status: 'received',
    referredBy: data.referredBy,
    referredByName: data.referredByName,
    notes: data.notes,
    priority: data.priority,
    patientPhone: data.patientPhone,
    attachments: data.attachments,
  });

  // Create a linked lab order so tests appear in the sample queue
  const labOrder = createLabOrder({
    patientId: referral.patientId,
    patientName: referral.patientName,
    patientMrn: referral.patientMrn,
    doctorId: 'external',
    doctorName: `Via ${data.partnerLabName}`,
    tests: data.tests.map((t) => ({
      testCode: t.testCode,
      testName: t.testName,
    })),
    status: 'ordered',
    priority: data.priority === 'urgent' ? 'urgent' : 'routine',
    notes: `Inbound referral from ${data.partnerLabName}. ${data.notes || ''}`.trim(),
    referralId: referral.id,
    sourceType: 'inbound_referral',
  });

  referral.labOrderId = labOrder.id;

  return { referral, labOrder };
};

// Updates an outbound referral with results data, sets status to results_received.
export const receiveOutboundResults = (
  referralId: string,
  externalRefNumber: string,
  testResults: ReferralTest[],
  resultAttachments?: string[]
): LabReferral | undefined => {
  const referral = mockLabReferrals.find((ref) => ref.id === referralId);
  if (!referral) return undefined;

  referral.externalReferenceNumber = externalRefNumber;
  referral.resultAttachments = resultAttachments;
  referral.status = 'results_received';

  // Merge results into existing tests
  for (const result of testResults) {
    const existing = referral.tests.find((t) => t.testCode === result.testCode);
    if (existing) {
      existing.result = result.result;
      existing.unit = result.unit;
      existing.normalRange = result.normalRange;
      existing.isAbnormal = result.isAbnormal;
    }
  }

  return referral;
};

// Takes an existing lab order and creates an outbound referral linked to it.
export const makeLabOrderOutbound = (
  labOrderId: string,
  partnerLabId: string,
  partnerLabName: string,
  referredBy: string,
  referredByName: string,
  notes?: string
): LabReferral | undefined => {
  const labOrder = mockLabOrders.find((o) => o.id === labOrderId);
  if (!labOrder) return undefined;

  const referral = createReferral({
    direction: 'outbound',
    patientId: labOrder.patientId,
    patientName: labOrder.patientName,
    patientMrn: labOrder.patientMrn,
    partnerLabId,
    partnerLabName,
    tests: labOrder.tests.map((t) => ({
      testCode: t.testCode,
      testName: t.testName,
    })),
    status: 'pending',
    referredBy,
    referredByName,
    notes,
    priority: labOrder.priority === 'stat' ? 'urgent' : labOrder.priority as 'routine' | 'urgent',
    sourceLabOrderId: labOrderId,
    orderingDoctorId: labOrder.doctorId,
    orderingDoctorName: labOrder.doctorName,
  });

  // Link the lab order to the referral
  labOrder.referralId = referral.id;
  labOrder.sourceType = 'outbound_referral';

  return referral;
};

// Marks an outbound referral as completed. If sourceLabOrderId exists, updates the linked lab order.
export const completeOutboundReferral = (referralId: string): LabReferral | undefined => {
  const referral = mockLabReferrals.find((ref) => ref.id === referralId);
  if (!referral) return undefined;

  referral.status = 'completed';
  referral.completedAt = new Date().toISOString();

  if (referral.sourceLabOrderId) {
    const labOrder = mockLabOrders.find((o) => o.id === referral.sourceLabOrderId);
    if (labOrder) {
      labOrder.isSubmittedToDoctor = true;
      labOrder.submittedAt = new Date().toISOString();
    }
  }

  return referral;
};
