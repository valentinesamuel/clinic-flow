// Mock HMO Claims Data

import { HMOClaim, HMOProvider } from '@/types/billing.types';

export const mockHMOProviders: HMOProvider[] = [
  {
    id: 'hyg-001',
    name: 'Hygeia HMO',
    code: 'HYG',
    contactPhone: '+234 1 271 2200',
    contactEmail: 'claims@hygeiahmo.com',
    address: '13A A.J Marinho Drive, Victoria Island, Lagos',
    defaultCopay: 5000,
    isActive: true,
  },
  {
    id: 'aii-001',
    name: 'AIICO Multishield',
    code: 'AII',
    contactPhone: '+234 1 279 7400',
    contactEmail: 'hmo@ailohealth.com',
    address: 'Plot PC 12, Churchgate Street, Victoria Island, Lagos',
    defaultCopay: 3000,
    isActive: true,
  },
  {
    id: 'axa-001',
    name: 'AXA Mansard',
    code: 'AXA',
    contactPhone: '+234 1 448 5991',
    contactEmail: 'hmo@axamansard.com',
    address: '2 Adeyemo Alakija Street, Victoria Island, Lagos',
    defaultCopay: 4000,
    isActive: true,
  },
  {
    id: 'rel-001',
    name: 'Reliance HMO',
    code: 'REL',
    contactPhone: '+234 700 073 5426',
    contactEmail: 'support@reliancehmo.com',
    address: '8 Toyin Street, Ikeja, Lagos',
    defaultCopay: 2500,
    isActive: true,
  },
];

export const mockClaims: HMOClaim[] = [
  {
    id: 'clm-001',
    claimNumber: 'CLM-2024-0001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    hmoProviderId: 'hyg-001',
    hmoProviderName: 'Hygeia HMO',
    enrollmentId: 'HYG-2024-ABC123',
    policyNumber: 'NHIA-12345-6789',
    billId: 'bill-001',
    claimAmount: 17500,
    status: 'submitted',
    submittedAt: '2024-02-01T12:00:00Z',
    diagnoses: [
      { code: 'I10', description: 'Essential (primary) hypertension', isPrimary: true },
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified', isPrimary: false },
    ],
    documents: [
      { id: 'doc-001', name: 'consultation_note.pdf', type: 'auto', source: 'consultation', uploadedAt: '2024-02-01T10:30:00Z' },
      { id: 'doc-002', name: 'lab_results.pdf', type: 'auto', source: 'lab', uploadedAt: '2024-02-01T10:30:00Z' },
    ],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-02-01T10:30:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 2, status: 'submitted', changedAt: '2024-02-01T12:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
    ],
    currentVersion: 2,
    createdAt: '2024-02-01T10:30:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'clm-002',
    claimNumber: 'CLM-2024-0002',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    hmoProviderId: 'axa-001',
    hmoProviderName: 'AXA Mansard',
    enrollmentId: 'AXA-2024-DEF456',
    policyNumber: 'NHIA-67890-1234',
    billId: 'bill-003',
    claimAmount: 16000,
    status: 'processing',
    submittedAt: '2024-02-01T15:00:00Z',
    diagnoses: [
      { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', isPrimary: true },
    ],
    documents: [
      { id: 'doc-003', name: 'consultation_note.pdf', type: 'auto', source: 'consultation', uploadedAt: '2024-02-01T14:30:00Z' },
    ],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-02-01T14:30:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 2, status: 'submitted', changedAt: '2024-02-01T15:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 3, status: 'processing', changedAt: '2024-02-01T16:00:00Z', changedBy: 'system', changedByName: 'System' },
    ],
    currentVersion: 3,
    createdAt: '2024-02-01T14:30:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'clm-003',
    claimNumber: 'CLM-2024-0003',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    hmoProviderId: 'rel-001',
    hmoProviderName: 'Reliance HMO',
    enrollmentId: 'REL-2024-GHI789',
    policyNumber: 'NHIA-11111-2222',
    billId: 'bill-005',
    claimAmount: 38500,
    status: 'draft',
    diagnoses: [
      { code: 'J45.20', description: 'Mild intermittent asthma, uncomplicated', isPrimary: true },
    ],
    documents: [],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-02-02T09:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
    ],
    currentVersion: 1,
    createdAt: '2024-02-02T09:00:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'clm-004',
    claimNumber: 'CLM-2024-0004',
    patientId: 'pat-008',
    patientName: 'Yakubu Abdullahi',
    hmoProviderId: 'aii-001',
    hmoProviderName: 'AIICO Multishield',
    enrollmentId: 'AII-2024-JKL012',
    policyNumber: 'NHIA-33333-4444',
    billId: 'bill-006',
    claimAmount: 25000,
    approvedAmount: 22000,
    status: 'approved',
    submittedAt: '2024-01-25T10:00:00Z',
    processedAt: '2024-01-30T14:00:00Z',
    diagnoses: [
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified', isPrimary: true },
      { code: 'I10', description: 'Essential (primary) hypertension', isPrimary: false },
    ],
    documents: [
      { id: 'doc-004', name: 'consultation_note.pdf', type: 'auto', source: 'consultation', uploadedAt: '2024-01-25T09:00:00Z' },
      { id: 'doc-005', name: 'prescription.pdf', type: 'auto', source: 'pharmacy', uploadedAt: '2024-01-25T09:00:00Z' },
    ],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-01-25T09:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 2, status: 'submitted', changedAt: '2024-01-25T10:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 3, status: 'processing', changedAt: '2024-01-27T10:00:00Z', changedBy: 'system', changedByName: 'System' },
      { version: 4, status: 'approved', changedAt: '2024-01-30T14:00:00Z', changedBy: 'system', changedByName: 'HMO' },
    ],
    currentVersion: 4,
    createdAt: '2024-01-25T09:00:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'clm-005',
    claimNumber: 'CLM-2024-0005',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    hmoProviderId: 'hyg-001',
    hmoProviderName: 'Hygeia HMO',
    enrollmentId: 'HYG-2024-ABC123',
    policyNumber: 'NHIA-12345-6789',
    billId: 'bill-007',
    claimAmount: 12000,
    status: 'denied',
    submittedAt: '2024-01-20T11:00:00Z',
    processedAt: '2024-01-28T16:00:00Z',
    denialReason: 'Service not covered under plan. Patient must upgrade plan or pay out of pocket.',
    diagnoses: [
      { code: 'M54.5', description: 'Low back pain', isPrimary: true },
    ],
    documents: [
      { id: 'doc-006', name: 'consultation_note.pdf', type: 'auto', source: 'consultation', uploadedAt: '2024-01-20T10:00:00Z' },
    ],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-01-20T10:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 2, status: 'submitted', changedAt: '2024-01-20T11:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 3, status: 'denied', changedAt: '2024-01-28T16:00:00Z', changedBy: 'system', changedByName: 'HMO', notes: 'Service not covered under plan' },
    ],
    currentVersion: 3,
    createdAt: '2024-01-20T10:00:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'clm-006',
    claimNumber: 'CLM-2024-0006',
    patientId: 'pat-008',
    patientName: 'Yakubu Abdullahi',
    hmoProviderId: 'aii-001',
    hmoProviderName: 'AIICO Multishield',
    enrollmentId: 'AII-2024-JKL012',
    policyNumber: 'NHIA-33333-4444',
    billId: 'bill-008',
    claimAmount: 18000,
    approvedAmount: 18000,
    status: 'paid',
    submittedAt: '2024-01-15T09:00:00Z',
    processedAt: '2024-01-22T11:00:00Z',
    diagnoses: [
      { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', isPrimary: true },
    ],
    documents: [
      { id: 'doc-007', name: 'consultation_note.pdf', type: 'auto', source: 'consultation', uploadedAt: '2024-01-15T08:00:00Z' },
      { id: 'doc-008', name: 'lab_results.pdf', type: 'auto', source: 'lab', uploadedAt: '2024-01-15T08:00:00Z' },
    ],
    versions: [
      { version: 1, status: 'draft', changedAt: '2024-01-15T08:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 2, status: 'submitted', changedAt: '2024-01-15T09:00:00Z', changedBy: 'usr-007', changedByName: 'Billing Officer' },
      { version: 3, status: 'approved', changedAt: '2024-01-20T11:00:00Z', changedBy: 'system', changedByName: 'HMO' },
      { version: 4, status: 'paid', changedAt: '2024-01-22T11:00:00Z', changedBy: 'system', changedByName: 'Finance' },
    ],
    currentVersion: 4,
    createdAt: '2024-01-15T08:00:00Z',
    createdBy: 'usr-007',
  },
];

export const getPendingClaims = (): HMOClaim[] => 
  mockClaims.filter(c => ['draft', 'submitted', 'processing'].includes(c.status));

export const getClaimsByStatus = (status: HMOClaim['status']): HMOClaim[] => 
  mockClaims.filter(c => c.status === status);

export const getClaimsByProvider = (providerId: string): HMOClaim[] => 
  mockClaims.filter(c => c.hmoProviderId === providerId);

export const getTotalPendingClaims = (): number => 
  getPendingClaims().reduce((sum, c) => sum + c.claimAmount, 0);

export const getHMOProviderById = (id: string): HMOProvider | undefined => 
  mockHMOProviders.find(p => p.id === id);

// Pagination and filtering helpers
export interface ClaimFilters {
  status?: HMOClaim['status'];
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export function getClaimsPaginated(
  page: number,
  limit: number,
  filters?: ClaimFilters
): { data: HMOClaim[]; total: number; totalPages: number } {
  let filtered = [...mockClaims];

  if (filters?.status) {
    filtered = filtered.filter((c) => c.status === filters.status);
  }

  if (filters?.providerId) {
    filtered = filtered.filter((c) => c.hmoProviderId === filters.providerId);
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter((c) => c.createdAt >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    filtered = filtered.filter((c) => c.createdAt <= filters.dateTo!);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.patientName.toLowerCase().includes(searchLower) ||
        c.claimNumber.toLowerCase().includes(searchLower) ||
        c.hmoProviderName.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, totalPages };
}

export function getClaimById(id: string): HMOClaim | undefined {
  return mockClaims.find((c) => c.id === id);
}

export function submitClaim(id: string): HMOClaim | undefined {
  const claim = mockClaims.find((c) => c.id === id);
  if (claim && claim.status === 'draft') {
    claim.status = 'submitted';
    claim.submittedAt = new Date().toISOString();
  }
  return claim;
}

export function updateClaimStatus(id: string, status: HMOClaim['status']): HMOClaim | undefined {
  const claim = mockClaims.find((c) => c.id === id);
  if (claim) {
    claim.status = status;
    if (['approved', 'denied', 'paid'].includes(status)) {
      claim.processedAt = new Date().toISOString();
    }
  }
  return claim;
}
