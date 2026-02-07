// Cashier Shifts Mock Data

import { CashierShift, ShiftTransaction, BillingCodeEntry, EmergencyOverride } from '@/types/cashier.types';

export const mockShifts: CashierShift[] = [
  {
    id: 'shift-001',
    cashierId: 'usr-007',
    cashierName: 'Blessing Okafor',
    station: 'main',
    startedAt: '2024-02-04T08:00:00Z',
    status: 'active',
    openingBalance: 50000,
    transactions: [
      {
        id: 'txn-001',
        receiptNumber: 'RCP-2024-A1B2C3',
        patientId: 'pat-002',
        patientName: 'Emmanuel Adeleke',
        patientMrn: 'LC-2024-0002',
        amount: 30600,
        paymentMethod: 'cash',
        timestamp: '2024-02-04T09:15:00Z',
      },
      {
        id: 'txn-002',
        receiptNumber: 'RCP-2024-D4E5F6',
        patientId: 'pat-004',
        patientName: 'Chukwudi Eze',
        patientMrn: 'LC-2024-0004',
        amount: 20000,
        paymentMethod: 'cash',
        timestamp: '2024-02-04T10:30:00Z',
      },
      {
        id: 'txn-003',
        receiptNumber: 'RCP-2024-G7H8I9',
        patientId: 'pat-008',
        patientName: 'Amara Okwu',
        patientMrn: 'LC-2024-0008',
        amount: 8000,
        paymentMethod: 'card',
        timestamp: '2024-02-04T11:45:00Z',
      },
      {
        id: 'txn-004',
        receiptNumber: 'RCP-2024-J0K1L2',
        patientId: 'pat-001',
        patientName: 'Adaora Okafor',
        patientMrn: 'LC-2024-0001',
        amount: 5000,
        paymentMethod: 'transfer',
        timestamp: '2024-02-04T12:00:00Z',
      },
    ],
  },
  {
    id: 'shift-002',
    cashierId: 'usr-008',
    cashierName: 'Chioma Nwachukwu',
    station: 'pharmacy',
    startedAt: '2024-02-04T08:00:00Z',
    status: 'active',
    openingBalance: 30000,
    transactions: [
      {
        id: 'txn-005',
        receiptNumber: 'RCP-2024-M3N4O5',
        patientId: 'pat-006',
        patientName: 'Nkechi Onyekachi',
        patientMrn: 'LC-2024-0006',
        amount: 5000,
        paymentMethod: 'cash',
        billingCode: 'PH3K7M2Q',
        timestamp: '2024-02-04T10:15:00Z',
      },
    ],
  },
];

export const mockBillingCodes: BillingCodeEntry[] = [
  {
    id: 'bc-001',
    code: 'PH3K7M2Q',
    billId: 'bill-006',
    patientId: 'pat-006',
    patientName: 'Nkechi Onyekachi',
    patientMrn: 'LC-2024-0006',
    department: 'pharmacy',
    amount: 5000,
    status: 'generated',
    generatedBy: 'usr-010',
    generatedByName: 'Pharm. Afolabi',
    generatedAt: '2024-02-02T10:00:00Z',
    expiresAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'bc-002',
    code: 'LB7K2M4P',
    billId: 'bill-003',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    department: 'lab',
    amount: 20000,
    hmoCoverage: 16000,
    patientLiability: 4000,
    status: 'generated',
    generatedBy: 'usr-011',
    generatedByName: 'Dr. Bello',
    generatedAt: '2024-02-01T14:00:00Z',
    expiresAt: '2024-02-04T14:00:00Z',
  },
  {
    id: 'bc-003',
    code: 'LB9P4N6R',
    billId: 'bill-007',
    patientId: 'pat-007',
    patientName: 'Tunde Bakare',
    patientMrn: 'LC-2024-0007',
    department: 'lab',
    amount: 21500,
    hmoCoverage: 19350,
    patientLiability: 2150,
    status: 'generated',
    generatedBy: 'usr-011',
    generatedByName: 'Dr. Bello',
    generatedAt: '2024-02-02T11:00:00Z',
    expiresAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'bc-004',
    code: 'PH5N8R3T',
    billId: 'bill-prev-001',
    patientId: 'pat-010',
    patientName: 'Halima Bello',
    patientMrn: 'LC-2024-0010',
    department: 'pharmacy',
    amount: 3500,
    status: 'paid',
    generatedBy: 'usr-010',
    generatedByName: 'Pharm. Afolabi',
    generatedAt: '2024-01-28T09:00:00Z',
    expiresAt: '2024-01-31T09:00:00Z',
    paidAt: '2024-01-28T10:30:00Z',
    paidBy: 'usr-007',
    receiptNumber: 'RCP-2024-PREV01',
  },
];

export const mockEmergencyOverrides: EmergencyOverride[] = [
  {
    id: 'eo-001',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    reason: 'Life-threatening asthma attack requiring immediate nebulisation and emergency medication. Patient in respiratory distress.',
    scope: 'consultation_emergency',
    estimatedAmount: 41000,
    authorizedBy: 'usr-002',
    authorizedByName: 'Dr. Chukwuemeka Nwosu',
    authorizedByRole: 'doctor',
    authorizedAt: '2024-02-02T08:25:00Z',
    status: 'active',
  },
];

// Helper functions
export function getCurrentShift(station: string, cashierId?: string): CashierShift | undefined {
  return mockShifts.find(
    (s) => s.station === station && s.status === 'active' && (!cashierId || s.cashierId === cashierId)
  );
}

export function getShiftTransactions(shiftId: string): ShiftTransaction[] {
  const shift = mockShifts.find((s) => s.id === shiftId);
  return shift?.transactions || [];
}

export function getBillingCodeByCode(code: string): BillingCodeEntry | undefined {
  return mockBillingCodes.find((bc) => bc.code.toUpperCase() === code.toUpperCase());
}

export function getPendingBillingCodes(department?: string): BillingCodeEntry[] {
  let codes = mockBillingCodes.filter((bc) => bc.status === 'generated');
  if (department && department !== 'all') {
    codes = codes.filter((bc) => bc.department === department);
  }
  return codes;
}

export function getActiveEmergencyOverrides(): EmergencyOverride[] {
  return mockEmergencyOverrides.filter((eo) => eo.status === 'active');
}

export function getEmergencyOverrideByPatient(patientId: string): EmergencyOverride | undefined {
  return mockEmergencyOverrides.find((eo) => eo.patientId === patientId && eo.status === 'active');
}

export function calculateShiftStats(shift: CashierShift): {
  transactionCount: number;
  totalCollected: number;
  cashCollected: number;
  cardCollected: number;
  transferCollected: number;
} {
  const transactions = shift.transactions;
  return {
    transactionCount: transactions.length,
    totalCollected: transactions.reduce((sum, t) => sum + t.amount, 0),
    cashCollected: transactions.filter((t) => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.amount, 0),
    cardCollected: transactions.filter((t) => t.paymentMethod === 'card').reduce((sum, t) => sum + t.amount, 0),
    transferCollected: transactions.filter((t) => t.paymentMethod === 'transfer').reduce((sum, t) => sum + t.amount, 0),
  };
}
