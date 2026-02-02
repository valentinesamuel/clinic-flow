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
    billId: 'bill-001',
    claimAmount: 17500,
    status: 'submitted',
    submittedAt: '2024-02-01T12:00:00Z',
    documents: ['consultation_note.pdf', 'lab_results.pdf'],
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
    billId: 'bill-003',
    claimAmount: 16000,
    status: 'processing',
    submittedAt: '2024-02-01T15:00:00Z',
    documents: ['consultation_note.pdf'],
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
    billId: 'bill-005',
    claimAmount: 38500,
    status: 'draft',
    documents: [],
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
    billId: 'bill-006',
    claimAmount: 25000,
    approvedAmount: 22000,
    status: 'approved',
    submittedAt: '2024-01-25T10:00:00Z',
    processedAt: '2024-01-30T14:00:00Z',
    documents: ['consultation_note.pdf', 'prescription.pdf'],
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
    billId: 'bill-007',
    claimAmount: 12000,
    status: 'denied',
    submittedAt: '2024-01-20T11:00:00Z',
    processedAt: '2024-01-28T16:00:00Z',
    denialReason: 'Service not covered under plan. Patient must upgrade plan or pay out of pocket.',
    documents: ['consultation_note.pdf'],
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
    billId: 'bill-008',
    claimAmount: 18000,
    approvedAmount: 18000,
    status: 'paid',
    submittedAt: '2024-01-15T09:00:00Z',
    processedAt: '2024-01-22T11:00:00Z',
    documents: ['consultation_note.pdf', 'lab_results.pdf'],
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
