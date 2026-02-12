import {
  HMOServiceCoverage,
  HMOCoverageType,
  ServiceCategory,
} from '@/types/billing.types';

/**
 * Mock HMO Service Coverage Data
 * Maps which services each HMO provider covers and at what level
 */
export const hmoServiceCoverages: HMOServiceCoverage[] = [
  // Hygeia HMO (hyg-001) - 15 entries
  {
    id: 'cov-001',
    hmoProviderId: 'hyg-001',
    serviceId: 'con-001',
    serviceName: 'General Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-002',
    hmoProviderId: 'hyg-001',
    serviceId: 'con-002',
    serviceName: 'Specialist Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-003',
    hmoProviderId: 'hyg-001',
    serviceId: 'con-003',
    serviceName: 'Follow-up Visit',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-004',
    hmoProviderId: 'hyg-001',
    serviceId: 'lab-001',
    serviceName: 'Full Blood Count',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-005',
    hmoProviderId: 'hyg-001',
    serviceId: 'lab-002',
    serviceName: 'Blood Sugar Test',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-006',
    hmoProviderId: 'hyg-001',
    serviceId: 'lab-003',
    serviceName: 'Urinalysis',
    serviceCategory: 'lab',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-007',
    hmoProviderId: 'hyg-001',
    serviceId: 'pha-001',
    serviceName: 'Paracetamol 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-008',
    hmoProviderId: 'hyg-001',
    serviceId: 'pha-002',
    serviceName: 'Amoxicillin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-009',
    hmoProviderId: 'hyg-001',
    serviceId: 'pha-003',
    serviceName: 'Metformin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-010',
    hmoProviderId: 'hyg-001',
    serviceId: 'pro-001',
    serviceName: 'Wound Dressing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-011',
    hmoProviderId: 'hyg-001',
    serviceId: 'pro-002',
    serviceName: 'Suturing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-012',
    hmoProviderId: 'hyg-001',
    serviceId: 'pro-003',
    serviceName: 'Minor Surgery',
    serviceCategory: 'procedure',
    coverageType: 'partial_flat',
    coverageFlatAmount: 50000,
    maxCoveredAmount: 50000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-013',
    hmoProviderId: 'hyg-001',
    serviceId: 'img-001',
    serviceName: 'X-Ray',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-014',
    hmoProviderId: 'hyg-001',
    serviceId: 'img-002',
    serviceName: 'Ultrasound',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 75,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-015',
    hmoProviderId: 'hyg-001',
    serviceId: 'img-003',
    serviceName: 'Echocardiography',
    serviceCategory: 'other',
    coverageType: 'partial_flat',
    coverageFlatAmount: 80000,
    maxCoveredAmount: 80000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },

  // AIICO Multishield (aii-001) - 15 entries
  {
    id: 'cov-016',
    hmoProviderId: 'aii-001',
    serviceId: 'con-001',
    serviceName: 'General Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-017',
    hmoProviderId: 'aii-001',
    serviceId: 'con-002',
    serviceName: 'Specialist Consultation',
    serviceCategory: 'consultation',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-018',
    hmoProviderId: 'aii-001',
    serviceId: 'con-003',
    serviceName: 'Follow-up Visit',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-019',
    hmoProviderId: 'aii-001',
    serviceId: 'lab-001',
    serviceName: 'Full Blood Count',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-020',
    hmoProviderId: 'aii-001',
    serviceId: 'lab-002',
    serviceName: 'Blood Sugar Test',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-021',
    hmoProviderId: 'aii-001',
    serviceId: 'lab-004',
    serviceName: 'Lipid Profile',
    serviceCategory: 'lab',
    coverageType: 'partial_flat',
    coverageFlatAmount: 8000,
    maxCoveredAmount: 8000,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-022',
    hmoProviderId: 'aii-001',
    serviceId: 'pha-001',
    serviceName: 'Paracetamol 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-023',
    hmoProviderId: 'aii-001',
    serviceId: 'pha-002',
    serviceName: 'Amoxicillin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-024',
    hmoProviderId: 'aii-001',
    serviceId: 'pha-004',
    serviceName: 'Lisinopril 10mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-025',
    hmoProviderId: 'aii-001',
    serviceId: 'pro-001',
    serviceName: 'Wound Dressing',
    serviceCategory: 'procedure',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-026',
    hmoProviderId: 'aii-001',
    serviceId: 'pro-002',
    serviceName: 'Suturing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-027',
    hmoProviderId: 'aii-001',
    serviceId: 'pro-004',
    serviceName: 'Incision and Drainage',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 75,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-028',
    hmoProviderId: 'aii-001',
    serviceId: 'img-001',
    serviceName: 'X-Ray',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-029',
    hmoProviderId: 'aii-001',
    serviceId: 'img-002',
    serviceName: 'Ultrasound',
    serviceCategory: 'other',
    coverageType: 'partial_flat',
    coverageFlatAmount: 10000,
    maxCoveredAmount: 10000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-030',
    hmoProviderId: 'aii-001',
    serviceId: 'adm-001',
    serviceName: 'Ward Admission',
    serviceCategory: 'admission',
    coverageType: 'none',
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },

  // AXA Mansard (axa-001) - 15 entries
  {
    id: 'cov-031',
    hmoProviderId: 'axa-001',
    serviceId: 'con-001',
    serviceName: 'General Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-032',
    hmoProviderId: 'axa-001',
    serviceId: 'con-002',
    serviceName: 'Specialist Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-033',
    hmoProviderId: 'axa-001',
    serviceId: 'con-003',
    serviceName: 'Follow-up Visit',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-034',
    hmoProviderId: 'axa-001',
    serviceId: 'con-004',
    serviceName: 'Emergency Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-035',
    hmoProviderId: 'axa-001',
    serviceId: 'lab-001',
    serviceName: 'Full Blood Count',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-036',
    hmoProviderId: 'axa-001',
    serviceId: 'lab-002',
    serviceName: 'Blood Sugar Test',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-037',
    hmoProviderId: 'axa-001',
    serviceId: 'lab-003',
    serviceName: 'Urinalysis',
    serviceCategory: 'lab',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-038',
    hmoProviderId: 'axa-001',
    serviceId: 'pha-001',
    serviceName: 'Paracetamol 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-039',
    hmoProviderId: 'axa-001',
    serviceId: 'pha-002',
    serviceName: 'Amoxicillin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-040',
    hmoProviderId: 'axa-001',
    serviceId: 'pha-003',
    serviceName: 'Metformin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-041',
    hmoProviderId: 'axa-001',
    serviceId: 'pro-001',
    serviceName: 'Wound Dressing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-042',
    hmoProviderId: 'axa-001',
    serviceId: 'pro-002',
    serviceName: 'Suturing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-043',
    hmoProviderId: 'axa-001',
    serviceId: 'img-001',
    serviceName: 'X-Ray',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-044',
    hmoProviderId: 'axa-001',
    serviceId: 'img-002',
    serviceName: 'Ultrasound',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-045',
    hmoProviderId: 'axa-001',
    serviceId: 'img-003',
    serviceName: 'Echocardiography',
    serviceCategory: 'other',
    coverageType: 'partial_flat',
    coverageFlatAmount: 100000,
    maxCoveredAmount: 100000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },

  // Reliance HMO (rel-001) - 15 entries
  {
    id: 'cov-046',
    hmoProviderId: 'rel-001',
    serviceId: 'con-001',
    serviceName: 'General Consultation',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-047',
    hmoProviderId: 'rel-001',
    serviceId: 'con-002',
    serviceName: 'Specialist Consultation',
    serviceCategory: 'consultation',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-048',
    hmoProviderId: 'rel-001',
    serviceId: 'con-003',
    serviceName: 'Follow-up Visit',
    serviceCategory: 'consultation',
    coverageType: 'full',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-049',
    hmoProviderId: 'rel-001',
    serviceId: 'lab-001',
    serviceName: 'Full Blood Count',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-050',
    hmoProviderId: 'rel-001',
    serviceId: 'lab-002',
    serviceName: 'Blood Sugar Test',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 85,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-051',
    hmoProviderId: 'rel-001',
    serviceId: 'lab-003',
    serviceName: 'Urinalysis',
    serviceCategory: 'lab',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-052',
    hmoProviderId: 'rel-001',
    serviceId: 'lab-004',
    serviceName: 'Lipid Profile',
    serviceCategory: 'lab',
    coverageType: 'partial_flat',
    coverageFlatAmount: 7000,
    maxCoveredAmount: 7000,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-053',
    hmoProviderId: 'rel-001',
    serviceId: 'pha-001',
    serviceName: 'Paracetamol 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-054',
    hmoProviderId: 'rel-001',
    serviceId: 'pha-002',
    serviceName: 'Amoxicillin 500mg',
    serviceCategory: 'pharmacy',
    coverageType: 'partial_percent',
    coveragePercentage: 90,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-055',
    hmoProviderId: 'rel-001',
    serviceId: 'pha-005',
    serviceName: 'Insulin Glargine',
    serviceCategory: 'pharmacy',
    coverageType: 'none',
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-056',
    hmoProviderId: 'rel-001',
    serviceId: 'pro-001',
    serviceName: 'Wound Dressing',
    serviceCategory: 'procedure',
    coverageType: 'partial_percent',
    coveragePercentage: 80,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-057',
    hmoProviderId: 'rel-001',
    serviceId: 'pro-003',
    serviceName: 'Minor Surgery',
    serviceCategory: 'procedure',
    coverageType: 'partial_flat',
    coverageFlatAmount: 40000,
    maxCoveredAmount: 40000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-058',
    hmoProviderId: 'rel-001',
    serviceId: 'img-001',
    serviceName: 'X-Ray',
    serviceCategory: 'other',
    coverageType: 'partial_percent',
    coveragePercentage: 75,
    requiresPreAuth: false,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-059',
    hmoProviderId: 'rel-001',
    serviceId: 'img-002',
    serviceName: 'Ultrasound',
    serviceCategory: 'other',
    coverageType: 'partial_flat',
    coverageFlatAmount: 8000,
    maxCoveredAmount: 8000,
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
  {
    id: 'cov-060',
    hmoProviderId: 'rel-001',
    serviceId: 'adm-002',
    serviceName: 'ICU Admission',
    serviceCategory: 'admission',
    coverageType: 'none',
    requiresPreAuth: true,
    isActive: true,
    updatedAt: '2025-01-15T10:00:00Z',
    updatedBy: 'admin-001',
  },
];

/**
 * Get coverage information for a specific service and HMO provider
 * @param serviceId - The service item ID
 * @param hmoProviderId - The HMO provider ID
 * @returns The coverage details or undefined if not found
 */
export function getCoverageForService(
  serviceId: string,
  hmoProviderId: string
): HMOServiceCoverage | undefined {
  return hmoServiceCoverages.find(
    (coverage) =>
      coverage.serviceId === serviceId &&
      coverage.hmoProviderId === hmoProviderId &&
      coverage.isActive
  );
}

/**
 * Get all coverage entries for a specific HMO provider
 * @param hmoProviderId - The HMO provider ID
 * @returns Array of coverage entries for the provider
 */
export function getCoveragesForProvider(
  hmoProviderId: string
): HMOServiceCoverage[] {
  return hmoServiceCoverages.filter(
    (coverage) =>
      coverage.hmoProviderId === hmoProviderId && coverage.isActive
  );
}

/**
 * Pagination and filtering interface for coverage queries
 */
export interface CoverageFilters {
  hmoProviderId?: string;
  serviceCategory?: ServiceCategory;
  search?: string;
  coverageType?: HMOCoverageType;
  requiresPreAuth?: boolean;
}

/**
 * Paginated response structure for coverage queries
 */
export interface PaginatedCoverageResponse {
  data: HMOServiceCoverage[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Get all coverages with pagination and optional filtering
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @param filters - Optional filters for HMO provider, service category, and search
 * @returns Paginated coverage data with metadata
 */
export function getAllCoveragesPaginated(
  page: number,
  limit: number,
  filters?: CoverageFilters
): PaginatedCoverageResponse {
  let filteredCoverages = [...hmoServiceCoverages];

  // Apply filters
  if (filters) {
    if (filters.hmoProviderId) {
      filteredCoverages = filteredCoverages.filter(
        (coverage) => coverage.hmoProviderId === filters.hmoProviderId
      );
    }

    if (filters.serviceCategory) {
      filteredCoverages = filteredCoverages.filter(
        (coverage) => coverage.serviceCategory === filters.serviceCategory
      );
    }

    if (filters.coverageType) {
      filteredCoverages = filteredCoverages.filter(
        (coverage) => coverage.coverageType === filters.coverageType
      );
    }

    if (filters.requiresPreAuth !== undefined) {
      filteredCoverages = filteredCoverages.filter(
        (coverage) => coverage.requiresPreAuth === filters.requiresPreAuth
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCoverages = filteredCoverages.filter(
        (coverage) =>
          coverage.serviceName.toLowerCase().includes(searchLower) ||
          coverage.serviceId.toLowerCase().includes(searchLower) ||
          coverage.hmoProviderId.toLowerCase().includes(searchLower)
      );
    }
  }

  const total = filteredCoverages.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredCoverages.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
}

/**
 * Update coverage information for a specific coverage entry
 * @param id - The coverage ID
 * @param updates - Partial coverage data to update
 * @returns The updated coverage or undefined if not found
 */
export function updateCoverage(
  id: string,
  updates: Partial<HMOServiceCoverage>
): HMOServiceCoverage | undefined {
  const index = hmoServiceCoverages.findIndex((coverage) => coverage.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedCoverage: HMOServiceCoverage = {
    ...hmoServiceCoverages[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  hmoServiceCoverages[index] = updatedCoverage;
  return updatedCoverage;
}

/**
 * Calculate the covered amount for a service based on HMO coverage rules
 * @param serviceAmount - The total service amount
 * @param coverage - The HMO coverage configuration
 * @returns Object with covered amount and patient responsibility
 */
export function calculateCoverageAmount(
  serviceAmount: number,
  coverage: HMOServiceCoverage
): {
  coveredAmount: number;
  patientAmount: number;
  coverageType: HMOCoverageType;
} {
  let coveredAmount = 0;

  switch (coverage.coverageType) {
    case 'full':
      coveredAmount = serviceAmount;
      break;

    case 'partial_percent':
      if (coverage.coveragePercentage) {
        coveredAmount = (serviceAmount * coverage.coveragePercentage) / 100;
        if (coverage.maxCoveredAmount) {
          coveredAmount = Math.min(coveredAmount, coverage.maxCoveredAmount);
        }
      }
      break;

    case 'partial_flat':
      if (coverage.coverageFlatAmount) {
        coveredAmount = Math.min(
          coverage.coverageFlatAmount,
          serviceAmount
        );
      }
      break;

    case 'none':
      coveredAmount = 0;
      break;
  }

  return {
    coveredAmount: Math.round(coveredAmount * 100) / 100,
    patientAmount: Math.round((serviceAmount - coveredAmount) * 100) / 100,
    coverageType: coverage.coverageType,
  };
}

/**
 * Get coverage statistics for a specific HMO provider
 * @param hmoProviderId - The HMO provider ID
 * @returns Statistics object with coverage breakdown
 */
export function getCoverageStats(hmoProviderId: string): {
  totalServices: number;
  fullCoverage: number;
  partialCoverage: number;
  noCoverage: number;
  requiresPreAuth: number;
  byCategory: Record<ServiceCategory, number>;
} {
  const coverages = getCoveragesForProvider(hmoProviderId);

  const stats = {
    totalServices: coverages.length,
    fullCoverage: 0,
    partialCoverage: 0,
    noCoverage: 0,
    requiresPreAuth: 0,
    byCategory: {
      consultation: 0,
      lab: 0,
      pharmacy: 0,
      procedure: 0,
      admission: 0,
      other: 0,
    } as Record<ServiceCategory, number>,
  };

  coverages.forEach((coverage) => {
    // Count coverage types
    if (coverage.coverageType === 'full') {
      stats.fullCoverage++;
    } else if (
      coverage.coverageType === 'partial_percent' ||
      coverage.coverageType === 'partial_flat'
    ) {
      stats.partialCoverage++;
    } else {
      stats.noCoverage++;
    }

    // Count pre-auth requirements
    if (coverage.requiresPreAuth) {
      stats.requiresPreAuth++;
    }

    // Count by category
    stats.byCategory[coverage.serviceCategory]++;
  });

  return stats;
}
