// Mock Lab Orders Data

import { LabOrder } from '@/types/clinical.types';

export const mockLabOrders: LabOrder[] = [
  {
    id: 'lab-001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'BP', testName: 'Blood Pressure Monitoring', result: '140/90 mmHg', normalRange: '<120/80 mmHg', isAbnormal: true },
    ],
    status: 'completed',
    priority: 'routine',
    orderedAt: '2024-02-01T09:30:00Z',
    collectedAt: '2024-02-01T09:45:00Z',
    completedAt: '2024-02-01T10:00:00Z',
    collectedBy: 'usr-005',
    processedBy: 'usr-009',
  },
  {
    id: 'lab-002',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'FBS', testName: 'Fasting Blood Sugar', result: '156 mg/dL', normalRange: '70-100 mg/dL', unit: 'mg/dL', isAbnormal: true },
      { testCode: 'HBA1C', testName: 'HbA1c', result: '7.2%', normalRange: '<5.7%', unit: '%', isAbnormal: true },
    ],
    status: 'completed',
    priority: 'routine',
    orderedAt: '2024-02-01T10:00:00Z',
    collectedAt: '2024-02-01T10:15:00Z',
    completedAt: '2024-02-01T11:30:00Z',
    collectedBy: 'usr-005',
    processedBy: 'usr-009',
  },
  {
    id: 'lab-003',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'FBC', testName: 'Full Blood Count' },
    ],
    status: 'sample_collected',
    priority: 'routine',
    orderedAt: '2024-02-01T14:30:00Z',
    collectedAt: '2024-02-01T14:45:00Z',
    collectedBy: 'usr-005',
  },
  {
    id: 'lab-004',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'XRAY-KNEE', testName: 'X-Ray - Bilateral Knees' },
    ],
    status: 'processing',
    priority: 'routine',
    orderedAt: '2024-02-01T15:00:00Z',
    collectedAt: '2024-02-01T15:30:00Z',
    collectedBy: 'usr-009',
    notes: 'Images captured, awaiting radiologist review',
  },
  {
    id: 'lab-005',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'ABG', testName: 'Arterial Blood Gas' },
      { testCode: 'CXR', testName: 'Chest X-Ray' },
    ],
    status: 'ordered',
    priority: 'stat',
    orderedAt: '2024-02-02T08:45:00Z',
    notes: 'URGENT - Emergency asthma case',
  },
  {
    id: 'lab-006',
    patientId: 'pat-006',
    patientName: 'Oluwafemi Adesanya',
    patientMrn: 'LC-2024-0006',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'FBC', testName: 'Full Blood Count' },
      { testCode: 'LFT', testName: 'Liver Function Test' },
      { testCode: 'RFT', testName: 'Renal Function Test' },
      { testCode: 'LIPID', testName: 'Lipid Profile' },
    ],
    status: 'ordered',
    priority: 'routine',
    orderedAt: '2024-02-02T09:00:00Z',
    notes: 'Annual physical examination labs',
  },
];

export const getPendingLabOrders = (): LabOrder[] => 
  mockLabOrders.filter(o => ['ordered', 'sample_collected', 'processing'].includes(o.status));

export const getLabOrdersByStatus = (status: LabOrder['status']): LabOrder[] => 
  mockLabOrders.filter(o => o.status === status);

export const getUrgentLabOrders = (): LabOrder[] => 
  mockLabOrders.filter(o => o.priority === 'stat' && o.status !== 'completed');

export const getLabOrdersByPatient = (patientId: string): LabOrder[] => 
  mockLabOrders.filter(o => o.patientId === patientId);

export const getLabResultsForReview = (): LabOrder[] => 
  mockLabOrders.filter(o => o.status === 'completed' && o.tests.some(t => t.isAbnormal));
