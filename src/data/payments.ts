// Mock Payments/Transactions Data

import { PaymentMethod, PaymentClearance, ServiceCategory } from '@/types/billing.types';

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  bank?: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  items: {
    description: string;
    category: ServiceCategory;
    amount: number;
  }[];
}

export const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-001',
    receiptNumber: 'RCP-2024-A1B2C3',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    billId: 'bill-002',
    amount: 30600,
    paymentMethod: 'cash',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-01T12:00:00Z',
    items: [
      { description: 'Consultation Fee', category: 'consultation', amount: 15000 },
      { description: 'Fasting Blood Sugar', category: 'lab', amount: 4000 },
      { description: 'HbA1c Test', category: 'lab', amount: 8000 },
      { description: 'Metformin 500mg x 60', category: 'pharmacy', amount: 3600 },
    ],
  },
  {
    id: 'pay-002',
    receiptNumber: 'RCP-2024-D4E5F6',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    billId: 'bill-004',
    amount: 20000,
    paymentMethod: 'card',
    referenceNumber: 'POS-20240201-45678',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-01T16:30:00Z',
    items: [
      { description: 'Consultation Fee', category: 'consultation', amount: 13500 },
      { description: 'Diclofenac 50mg x 30', category: 'pharmacy', amount: 2500 },
      { description: 'Partial X-Ray Payment', category: 'lab', amount: 4000 },
    ],
  },
  {
    id: 'pay-003',
    receiptNumber: 'RCP-2024-G7H8I9',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    billId: 'bill-001',
    amount: 5000,
    paymentMethod: 'hmo',
    referenceNumber: 'HYG-2024-COPAY-001',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-01T10:30:00Z',
    items: [
      { description: 'HMO Co-pay', category: 'consultation', amount: 5000 },
    ],
  },
  {
    id: 'pay-004',
    receiptNumber: 'RCP-2024-J1K2L3',
    patientId: 'pat-006',
    patientName: 'Ngozi Adekunle',
    patientMrn: 'LC-2024-0006',
    billId: 'bill-010',
    amount: 45000,
    paymentMethod: 'transfer',
    referenceNumber: 'TRF-GTB-20240201-12345',
    bank: 'gtb',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-01T14:15:00Z',
    items: [
      { description: 'Consultation Fee', category: 'consultation', amount: 15000 },
      { description: 'Full Blood Count', category: 'lab', amount: 5000 },
      { description: 'Liver Function Test', category: 'lab', amount: 10000 },
      { description: 'Ultrasound Scan', category: 'procedure', amount: 15000 },
    ],
  },
  {
    id: 'pay-005',
    receiptNumber: 'RCP-2024-M4N5O6',
    patientId: 'pat-007',
    patientName: 'Ibrahim Musa',
    patientMrn: 'LC-2024-0007',
    billId: 'bill-011',
    amount: 22500,
    paymentMethod: 'cash',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-02T09:00:00Z',
    items: [
      { description: 'Consultation Fee', category: 'consultation', amount: 15000 },
      { description: 'Malaria Rapid Test', category: 'lab', amount: 2500 },
      { description: 'Artemether-Lumefantrine', category: 'pharmacy', amount: 5000 },
    ],
  },
  {
    id: 'pay-006',
    receiptNumber: 'RCP-2024-P7Q8R9',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    billId: 'bill-003',
    amount: 4000,
    paymentMethod: 'hmo',
    referenceNumber: 'AXA-2024-COPAY-002',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    createdAt: '2024-02-01T14:30:00Z',
    items: [
      { description: 'HMO Co-pay', category: 'consultation', amount: 4000 },
    ],
  },
];

// Pagination and filtering helpers
export interface PaymentFilters {
  method?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export function getPaymentsPaginated(
  page: number,
  limit: number,
  filters?: PaymentFilters
): { data: PaymentRecord[]; total: number; totalPages: number } {
  let filtered = [...mockPayments];

  if (filters?.method) {
    filtered = filtered.filter((p) => p.paymentMethod === filters.method);
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter((p) => p.createdAt >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    filtered = filtered.filter((p) => p.createdAt <= filters.dateTo!);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.patientName.toLowerCase().includes(searchLower) ||
        p.patientMrn.toLowerCase().includes(searchLower) ||
        p.receiptNumber.toLowerCase().includes(searchLower) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchLower))
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

export function getPaymentById(id: string): PaymentRecord | undefined {
  return mockPayments.find((p) => p.id === id);
}

export function getPaymentsByDateRange(start: string, end: string): PaymentRecord[] {
  return mockPayments.filter((p) => p.createdAt >= start && p.createdAt <= end);
}

export function getDailyRevenue(date?: string): {
  cash: number;
  card: number;
  transfer: number;
  hmo: number;
  total: number;
} {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const dayPayments = mockPayments.filter((p) => p.createdAt.startsWith(targetDate));

  const cash = dayPayments.filter((p) => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.amount, 0);
  const card = dayPayments.filter((p) => p.paymentMethod === 'card').reduce((sum, p) => sum + p.amount, 0);
  const transfer = dayPayments.filter((p) => p.paymentMethod === 'transfer').reduce((sum, p) => sum + p.amount, 0);
  const hmo = dayPayments.filter((p) => p.paymentMethod === 'hmo').reduce((sum, p) => sum + p.amount, 0);

  return {
    cash,
    card,
    transfer,
    hmo,
    total: cash + card + transfer + hmo,
  };
}

export function getTodaysPayments(): PaymentRecord[] {
  const today = new Date().toISOString().split('T')[0];
  return mockPayments.filter((p) => p.createdAt.startsWith(today));
}
