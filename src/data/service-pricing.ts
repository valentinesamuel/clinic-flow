// Service Pricing Mock Data

import { ServicePrice, PriceApproval } from '@/types/cashier.types';

export const mockServicePrices: ServicePrice[] = [
  // Consultation Services
  {
    id: 'svc-001',
    code: 'CONS-GEN-001',
    name: 'General Consultation',
    description: 'Standard outpatient consultation with general practitioner',
    category: 'consultation',
    standardPrice: 15000,
    hmoPrice: 12000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-002',
    code: 'CONS-SPEC-001',
    name: 'Specialist Consultation',
    description: 'Consultation with specialist physician',
    category: 'consultation',
    standardPrice: 25000,
    hmoPrice: 20000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-003',
    code: 'CONS-EMRG-001',
    name: 'Emergency Consultation',
    description: 'Emergency room consultation',
    category: 'consultation',
    standardPrice: 30000,
    hmoPrice: 25000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Laboratory Services
  {
    id: 'svc-010',
    code: 'LAB-FBC-001',
    name: 'Full Blood Count',
    description: 'Complete blood count with differentials',
    category: 'lab',
    standardPrice: 5500,
    hmoPrice: 4500,
    isTaxable: false,
    isActive: true,
    status: 'pending',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'svc-011',
    code: 'LAB-MP-001',
    name: 'Malaria Parasite Test',
    description: 'Thick and thin blood film for malaria',
    category: 'lab',
    standardPrice: 2500,
    hmoPrice: 2000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-012',
    code: 'LAB-FBS-001',
    name: 'Fasting Blood Sugar',
    description: 'Fasting glucose test',
    category: 'lab',
    standardPrice: 4000,
    hmoPrice: 3500,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-013',
    code: 'LAB-HBA1C-001',
    name: 'HbA1c Test',
    description: 'Glycated hemoglobin test for diabetes monitoring',
    category: 'lab',
    standardPrice: 8000,
    hmoPrice: 7000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-014',
    code: 'LAB-LFT-001',
    name: 'Liver Function Test',
    description: 'Comprehensive liver panel',
    category: 'lab',
    standardPrice: 8000,
    hmoPrice: 7000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-015',
    code: 'LAB-KFT-001',
    name: 'Kidney Function Test',
    description: 'Renal panel including creatinine and BUN',
    category: 'lab',
    standardPrice: 7500,
    hmoPrice: 6500,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-016',
    code: 'LAB-LIPID-001',
    name: 'Lipid Profile',
    description: 'Cholesterol, triglycerides, HDL, LDL',
    category: 'lab',
    standardPrice: 6000,
    hmoPrice: 5000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-017',
    code: 'LAB-XRAY-001',
    name: 'X-Ray (Single View)',
    description: 'Standard radiograph single view',
    category: 'lab',
    standardPrice: 12000,
    hmoPrice: 10000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
    isPremium: true,
  },

  // Pharmacy Items
  {
    id: 'svc-020',
    code: 'PHRM-AMOX-001',
    name: 'Amoxicillin 500mg x 21',
    description: 'Amoxicillin capsules 500mg, 21 capsules',
    category: 'pharmacy',
    standardPrice: 3500,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
    department: 'pharmacy',
  },
  {
    id: 'svc-021',
    code: 'PHRM-PARA-001',
    name: 'Paracetamol 500mg x 20',
    description: 'Paracetamol tablets 500mg, 20 tablets',
    category: 'pharmacy',
    standardPrice: 1200,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
    department: 'pharmacy',
  },
  {
    id: 'svc-022',
    code: 'PHRM-METF-001',
    name: 'Metformin 500mg x 60',
    description: 'Metformin tablets 500mg, 60 tablets',
    category: 'pharmacy',
    standardPrice: 3600,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
    department: 'pharmacy',
  },

  // Procedures
  {
    id: 'svc-030',
    code: 'PROC-NEB-001',
    name: 'Nebulization',
    description: 'Single nebulization session',
    category: 'procedure',
    standardPrice: 5000,
    hmoPrice: 4000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-031',
    code: 'PROC-DRESS-001',
    name: 'Wound Dressing',
    description: 'Simple wound dressing',
    category: 'procedure',
    standardPrice: 5000,
    hmoPrice: 4000,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'svc-032',
    code: 'PROC-IVC-001',
    name: 'IV Cannulation',
    description: 'Intravenous catheter insertion',
    category: 'procedure',
    standardPrice: 3000,
    hmoPrice: 2500,
    isTaxable: false,
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'usr-admin',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockPriceApprovals: PriceApproval[] = [
  {
    id: 'appr-001',
    serviceId: 'svc-010',
    serviceName: 'Full Blood Count',
    serviceCode: 'LAB-FBC-001',
    category: 'lab',
    oldPrice: 5000,
    newPrice: 5500,
    changePercentage: 10,
    reason: 'Increased cost of reagents due to exchange rate fluctuation',
    requestedBy: 'usr-admin',
    requestedByName: 'Dr. Adeyemi',
    requestedByRole: 'hospital_admin',
    requestedAt: '2024-02-01T10:30:00Z',
    status: 'pending',
    isNewService: false,
  },
  {
    id: 'appr-002',
    serviceId: 'svc-new-001',
    serviceName: 'COVID-19 PCR Test',
    serviceCode: 'LAB-COVID-001',
    category: 'lab',
    newPrice: 35000,
    reason: 'New laboratory service for COVID-19 molecular testing',
    requestedBy: 'usr-admin',
    requestedByName: 'Dr. Adeyemi',
    requestedByRole: 'hospital_admin',
    requestedAt: '2024-02-02T09:00:00Z',
    status: 'pending',
    isNewService: true,
  },
  {
    id: 'appr-003',
    serviceId: 'svc-003',
    serviceName: 'Emergency Consultation',
    serviceCode: 'CONS-EMRG-001',
    category: 'consultation',
    oldPrice: 25000,
    newPrice: 30000,
    changePercentage: 20,
    reason: 'Aligned with market rates and increased operational costs for emergency services',
    requestedBy: 'usr-admin',
    requestedByName: 'Dr. Adeyemi',
    requestedByRole: 'hospital_admin',
    requestedAt: '2024-01-28T14:00:00Z',
    status: 'approved',
    reviewedBy: 'usr-cmo',
    reviewedByName: 'Dr. Nwosu',
    reviewedAt: '2024-01-29T11:00:00Z',
    reviewNotes: 'Approved. Competitive with other facilities.',
    isNewService: false,
  },
  {
    id: 'appr-004',
    serviceId: 'svc-030',
    serviceName: 'Nebulization',
    serviceCode: 'PROC-NEB-001',
    category: 'procedure',
    oldPrice: 5000,
    newPrice: 6500,
    changePercentage: 30,
    reason: 'Significant increase in consumables cost and equipment maintenance',
    requestedBy: 'usr-nurse',
    requestedByName: 'Nurse Okafor',
    requestedByRole: 'nurse',
    requestedAt: '2024-02-03T08:15:00Z',
    status: 'pending',
    isNewService: false,
  },
  {
    id: 'appr-005',
    serviceId: 'svc-017',
    serviceName: 'X-Ray (Single View)',
    serviceCode: 'LAB-XRAY-001',
    category: 'lab',
    oldPrice: 12000,
    newPrice: 13200,
    changePercentage: 10,
    reason: 'Updated to reflect current market rates for radiology services',
    requestedBy: 'usr-radiologist',
    requestedByName: 'Dr. Ibrahim',
    requestedByRole: 'doctor',
    requestedAt: '2024-02-04T11:45:00Z',
    status: 'pending',
    isNewService: false,
  },
  {
    id: 'appr-006',
    serviceId: 'svc-020',
    serviceName: 'Amoxicillin 500mg x 21',
    serviceCode: 'PHRM-AMOX-001',
    category: 'pharmacy',
    oldPrice: 3500,
    newPrice: 2800,
    changePercentage: -20,
    reason: 'Bulk purchase discount from new supplier allows price reduction',
    requestedBy: 'usr-pharmacist',
    requestedByName: 'Pharm. Chukwu',
    requestedByRole: 'pharmacist',
    requestedAt: '2024-01-30T16:20:00Z',
    status: 'approved',
    reviewedBy: 'usr-cmo',
    reviewedByName: 'Dr. Nwosu',
    reviewedAt: '2024-01-31T09:30:00Z',
    reviewNotes: 'Approved. Beneficial to patients, supplier verified.',
    isNewService: false,
  },
  {
    id: 'appr-007',
    serviceId: 'svc-new-002',
    serviceName: 'Telemedicine Consultation',
    serviceCode: 'CONS-TELE-001',
    category: 'consultation',
    newPrice: 8000,
    reason: 'New service offering for remote patient consultations via video call',
    requestedBy: 'usr-admin',
    requestedByName: 'Dr. Adeyemi',
    requestedByRole: 'hospital_admin',
    requestedAt: '2024-02-05T10:00:00Z',
    status: 'pending',
    isNewService: true,
  },
  {
    id: 'appr-008',
    serviceId: 'svc-014',
    serviceName: 'Liver Function Test',
    serviceCode: 'LAB-LFT-001',
    category: 'lab',
    oldPrice: 8000,
    newPrice: 7000,
    changePercentage: -12.5,
    reason: 'Price reduction to match competitor rates and improve accessibility',
    requestedBy: 'usr-admin',
    requestedByName: 'Dr. Adeyemi',
    requestedByRole: 'hospital_admin',
    requestedAt: '2024-01-25T13:30:00Z',
    status: 'rejected',
    reviewedBy: 'usr-cmo',
    reviewedByName: 'Dr. Nwosu',
    reviewedAt: '2024-01-26T10:15:00Z',
    rejectionReason: 'Price reduction not sustainable given current reagent costs. Consider renegotiating with suppliers first.',
    isNewService: false,
  },
];

// Helper functions
export function getServicePrices(filters?: {
  category?: string;
  status?: string;
  search?: string;
}): ServicePrice[] {
  let result = [...mockServicePrices];

  if (filters?.category && filters.category !== 'all') {
    result = result.filter((s) => s.category === filters.category);
  }

  if (filters?.status && filters.status !== 'all') {
    result = result.filter((s) => s.status === filters.status);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower)
    );
  }

  return result;
}

export function getPendingApprovals(): PriceApproval[] {
  return mockPriceApprovals.filter((a) => a.status === 'pending');
}

export function getApprovalById(id: string): PriceApproval | undefined {
  return mockPriceApprovals.find((a) => a.id === id);
}

export function getServicePriceById(id: string): ServicePrice | undefined {
  return mockServicePrices.find((s) => s.id === id);
}

export function getServicePricesPaginated(
  page: number,
  limit: number,
  filters?: { category?: string; status?: string; search?: string }
): { data: ServicePrice[]; total: number; totalPages: number } {
  const filtered = getServicePrices(filters);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total, totalPages };
}

export function getAllApprovals(): PriceApproval[] {
  return mockPriceApprovals;
}

export function getApprovalHistory(): PriceApproval[] {
  return mockPriceApprovals.filter(
    (a) => a.status === 'approved' || a.status === 'rejected'
  );
}

export function updateApprovalStatus(
  id: string,
  status: PriceApprovalStatus,
  reviewNotes?: string,
  reviewedBy?: string,
  reviewedByName?: string
): void {
  const approval = mockPriceApprovals.find((a) => a.id === id);
  if (approval) {
    approval.status = status;
    approval.reviewedAt = new Date().toISOString();
    if (reviewedBy) approval.reviewedBy = reviewedBy;
    if (reviewedByName) approval.reviewedByName = reviewedByName;
    if (status === 'approved' && reviewNotes) {
      approval.reviewNotes = reviewNotes;
    } else if (status === 'rejected' && reviewNotes) {
      approval.rejectionReason = reviewNotes;
    }
  }
}
