// Mock Bills Data

import { Bill, BillingDepartment } from '@/types/billing.types';

export const mockBills: Bill[] = [
  {
    id: 'bill-001',
    billNumber: 'INV-2024-0001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    visitId: 'vis-001',
    department: 'front_desk',
    createdByRole: 'cashier',
    items: [
      { id: 'bi-001', description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 15000, discount: 0, total: 15000 },
      { id: 'bi-002', description: 'Blood Pressure Test', category: 'lab', quantity: 1, unitPrice: 3000, discount: 0, total: 3000 },
      { id: 'bi-003', description: 'Lisinopril 10mg x 30', category: 'pharmacy', quantity: 1, unitPrice: 4500, discount: 0, total: 4500 },
    ],
    subtotal: 22500,
    discount: 0,
    tax: 0,
    total: 22500,
    amountPaid: 5000,
    balance: 17500,
    status: 'pending',
    paymentMethod: 'hmo',
    hmoClaimId: 'clm-001',
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'usr-007',
    notes: 'HMO copay collected, claim submitted',
  },
  {
    id: 'bill-002',
    billNumber: 'INV-2024-0002',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    visitId: 'vis-002',
    department: 'front_desk',
    createdByRole: 'receptionist',
    items: [
      { id: 'bi-004', description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 15000, discount: 0, total: 15000 },
      { id: 'bi-005', description: 'Fasting Blood Sugar', category: 'lab', quantity: 1, unitPrice: 4000, discount: 0, total: 4000 },
      { id: 'bi-006', description: 'HbA1c Test', category: 'lab', quantity: 1, unitPrice: 8000, discount: 0, total: 8000 },
      { id: 'bi-007', description: 'Metformin 500mg x 60', category: 'pharmacy', quantity: 1, unitPrice: 3600, discount: 0, total: 3600 },
    ],
    subtotal: 30600,
    discount: 0,
    tax: 0,
    total: 30600,
    amountPaid: 30600,
    balance: 0,
    status: 'paid',
    paymentMethod: 'cash',
    createdAt: '2024-02-01T11:30:00Z',
    createdBy: 'usr-007',
    paidAt: '2024-02-01T12:00:00Z',
  },
  {
    id: 'bill-003',
    billNumber: 'INV-2024-0003',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    visitId: 'vis-003',
    department: 'lab',
    createdByRole: 'lab_tech',
    billingCode: 'LB7K2M4P',
    billingCodeExpiry: '2024-02-04T14:00:00Z',
    items: [
      { id: 'bi-008', description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 15000, discount: 0, total: 15000 },
      { id: 'bi-009', description: 'Full Blood Count', category: 'lab', quantity: 1, unitPrice: 5000, discount: 0, total: 5000 },
    ],
    subtotal: 20000,
    discount: 0,
    tax: 0,
    total: 20000,
    amountPaid: 4000,
    balance: 16000,
    status: 'pending',
    paymentMethod: 'hmo',
    hmoClaimId: 'clm-002',
    createdAt: '2024-02-01T14:00:00Z',
    createdBy: 'usr-007',
  },
  {
    id: 'bill-004',
    billNumber: 'INV-2024-0004',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    visitId: 'vis-004',
    department: 'front_desk',
    createdByRole: 'cashier',
    items: [
      { id: 'bi-010', description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 15000, discount: 1500, total: 13500 },
      { id: 'bi-011', description: 'X-Ray - Knee', category: 'lab', quantity: 2, unitPrice: 12000, discount: 0, total: 24000 },
      { id: 'bi-012', description: 'Diclofenac 50mg x 30', category: 'pharmacy', quantity: 1, unitPrice: 2500, discount: 0, total: 2500 },
    ],
    subtotal: 40000,
    discount: 1500,
    tax: 0,
    total: 38500,
    amountPaid: 20000,
    balance: 18500,
    status: 'partial',
    paymentMethod: 'cash',
    createdAt: '2024-02-01T15:30:00Z',
    createdBy: 'usr-007',
    notes: 'Senior citizen discount applied. Balance to be paid next visit.',
  },
  {
    id: 'bill-005',
    billNumber: 'INV-2024-0005',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    visitId: 'vis-005',
    department: 'front_desk',
    createdByRole: 'cashier',
    items: [
      { id: 'bi-013', description: 'Emergency Consultation', category: 'consultation', quantity: 1, unitPrice: 25000, discount: 0, total: 25000 },
      { id: 'bi-014', description: 'Nebulization x 2', category: 'procedure', quantity: 2, unitPrice: 5000, discount: 0, total: 10000 },
      { id: 'bi-015', description: 'Ventolin Inhaler', category: 'pharmacy', quantity: 1, unitPrice: 4500, discount: 0, total: 4500 },
      { id: 'bi-016', description: 'Prednisolone 5mg x 20', category: 'pharmacy', quantity: 1, unitPrice: 1500, discount: 0, total: 1500 },
    ],
    subtotal: 41000,
    discount: 0,
    tax: 0,
    total: 41000,
    amountPaid: 2500,
    balance: 38500,
    status: 'pending',
    paymentMethod: 'hmo',
    hmoClaimId: 'clm-003',
    createdAt: '2024-02-02T08:30:00Z',
    createdBy: 'usr-007',
    notes: 'Emergency case. HMO preauthorization pending.',
  },
  {
    id: 'bill-006',
    billNumber: 'INV-2024-0006',
    patientId: 'pat-006',
    patientName: 'Nkechi Onyekachi',
    patientMrn: 'LC-2024-0006',
    visitId: 'vis-006',
    department: 'pharmacy',
    createdByRole: 'pharmacist',
    billingCode: 'PH3K7M2Q',
    billingCodeExpiry: '2024-02-05T10:00:00Z',
    items: [
      { id: 'bi-017', description: 'Amoxicillin 500mg x 21', category: 'pharmacy', quantity: 1, unitPrice: 3500, discount: 0, total: 3500 },
      { id: 'bi-018', description: 'Ibuprofen 400mg x 20', category: 'pharmacy', quantity: 1, unitPrice: 1500, discount: 0, total: 1500 },
    ],
    subtotal: 5000,
    discount: 0,
    tax: 0,
    total: 5000,
    amountPaid: 0,
    balance: 5000,
    status: 'pending',
    paymentMethod: 'cash',
    createdAt: '2024-02-02T10:00:00Z',
    createdBy: 'usr-010',
  },
  {
    id: 'bill-007',
    billNumber: 'INV-2024-0007',
    patientId: 'pat-007',
    patientName: 'Tunde Bakare',
    patientMrn: 'LC-2024-0007',
    visitId: 'vis-007',
    department: 'lab',
    createdByRole: 'lab_tech',
    billingCode: 'LB9P4N6R',
    billingCodeExpiry: '2024-02-05T11:00:00Z',
    items: [
      { id: 'bi-019', description: 'Liver Function Test', category: 'lab', quantity: 1, unitPrice: 8000, discount: 0, total: 8000 },
      { id: 'bi-020', description: 'Kidney Function Test', category: 'lab', quantity: 1, unitPrice: 7500, discount: 0, total: 7500 },
      { id: 'bi-021', description: 'Lipid Profile', category: 'lab', quantity: 1, unitPrice: 6000, discount: 0, total: 6000 },
    ],
    subtotal: 21500,
    discount: 0,
    tax: 0,
    total: 21500,
    amountPaid: 0,
    balance: 21500,
    status: 'pending',
    paymentMethod: 'hmo',
    createdAt: '2024-02-02T11:00:00Z',
    createdBy: 'usr-011',
  },
  {
    id: 'bill-008',
    billNumber: 'INV-2024-0008',
    patientId: 'pat-008',
    patientName: 'Amara Okwu',
    patientMrn: 'LC-2024-0008',
    visitId: 'vis-008',
    department: 'nursing',
    createdByRole: 'nurse',
    items: [
      { id: 'bi-022', description: 'Wound Dressing', category: 'procedure', quantity: 1, unitPrice: 5000, discount: 0, total: 5000 },
      { id: 'bi-023', description: 'IV Cannulation', category: 'procedure', quantity: 1, unitPrice: 3000, discount: 0, total: 3000 },
    ],
    subtotal: 8000,
    discount: 0,
    tax: 0,
    total: 8000,
    amountPaid: 8000,
    balance: 0,
    status: 'paid',
    paymentMethod: 'card',
    createdAt: '2024-02-02T12:00:00Z',
    createdBy: 'usr-005',
    paidAt: '2024-02-02T12:30:00Z',
  },
];

export const getPendingBills = (): Bill[] => 
  mockBills.filter(b => ['pending', 'partial'].includes(b.status));

export const getTotalPendingAmount = (): number => 
  mockBills.reduce((sum, b) => sum + b.balance, 0);

export const getBillsByPatient = (patientId: string): Bill[] => 
  mockBills.filter(b => b.patientId === patientId);

export const getTodaysBills = (): Bill[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockBills.filter(b => b.createdAt.startsWith(today));
};

export const getBillsByDepartment = (department: BillingDepartment): Bill[] => {
  if (department === 'all') return mockBills;
  return mockBills.filter(b => b.department === department);
};

export const getPendingBillsByDepartment = (department: BillingDepartment): Bill[] => {
  const bills = department === 'all' ? mockBills : mockBills.filter(b => b.department === department);
  return bills.filter(b => ['pending', 'partial'].includes(b.status));
};

export const getBillByCode = (code: string): Bill | undefined => {
  return mockBills.find(b => b.billingCode === code);
};

export const getRecentBills = (limit: number = 5): Bill[] => {
  return [...mockBills]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getTodaysRevenue = (): { cash: number; card: number; transfer: number; hmo: number; total: number } => {
  const today = new Date().toISOString().split('T')[0];
  const todaysBills = mockBills.filter(b => b.createdAt.startsWith(today) && b.amountPaid > 0);
  
  return todaysBills.reduce((acc, bill) => {
    const method = bill.paymentMethod || 'cash';
    if (method === 'cash') acc.cash += bill.amountPaid;
    else if (method === 'card') acc.card += bill.amountPaid;
    else if (method === 'transfer') acc.transfer += bill.amountPaid;
    else if (method === 'hmo') acc.hmo += bill.amountPaid;
    acc.total += bill.amountPaid;
    return acc;
  }, { cash: 0, card: 0, transfer: 0, hmo: 0, total: 0 });
};

// Pagination and filtering helpers
export interface BillFilters {
  status?: Bill['status'];
  department?: BillingDepartment;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export function getBillsPaginated(
  page: number,
  limit: number,
  filters?: BillFilters
): { data: Bill[]; total: number; totalPages: number } {
  let filtered = [...mockBills];

  if (filters?.department && filters.department !== 'all') {
    filtered = filtered.filter((b) => b.department === filters.department);
  }

  if (filters?.status) {
    filtered = filtered.filter((b) => b.status === filters.status);
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter((b) => b.createdAt >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    filtered = filtered.filter((b) => b.createdAt <= filters.dateTo!);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.patientName.toLowerCase().includes(searchLower) ||
        b.patientMrn.toLowerCase().includes(searchLower) ||
        b.billNumber.toLowerCase().includes(searchLower) ||
        (b.billingCode && b.billingCode.toLowerCase().includes(searchLower))
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

export function getBillById(id: string): Bill | undefined {
  return mockBills.find((b) => b.id === id);
}

export function getBillsByEpisode(episodeId: string): Bill[] {
  return mockBills.filter((b) => b.episodeId === episodeId);
}

export function updateBillStatus(id: string, status: Bill['status']): Bill | undefined {
  const bill = mockBills.find((b) => b.id === id);
  if (bill) {
    bill.status = status;
    if (status === 'paid') {
      bill.paidAt = new Date().toISOString();
      bill.balance = 0;
      bill.amountPaid = bill.total;
    }
  }
  return bill;
}
