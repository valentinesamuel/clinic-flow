// Mock Lab Orders Data

import { LabOrder, TestCatalogEntry } from '@/types/clinical.types';

// Test Catalog - reference range management
export const testCatalog: TestCatalogEntry[] = [
  { testCode: 'FBC', testName: 'Full Blood Count', category: 'Haematology', defaultUnit: 'cells/L', defaultRange: 'See panel', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'FBS', testName: 'Fasting Blood Sugar', category: 'Chemistry', defaultUnit: 'mg/dL', defaultRange: '70-100', criticalLow: 40, criticalHigh: 400, methodology: 'Enzymatic (Hexokinase)', sampleType: 'Serum' },
  { testCode: 'HBA1C', testName: 'HbA1c', category: 'Chemistry', defaultUnit: '%', defaultRange: '<5.7', criticalLow: undefined, criticalHigh: 14, methodology: 'HPLC', sampleType: 'Whole Blood (EDTA)' },
  { testCode: 'LFT', testName: 'Liver Function Test', category: 'Chemistry', defaultUnit: 'U/L', defaultRange: 'See panel', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'RFT', testName: 'Renal Function Test', category: 'Chemistry', defaultUnit: 'mg/dL', defaultRange: 'See panel', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'LIPID', testName: 'Lipid Profile', category: 'Chemistry', defaultUnit: 'mg/dL', defaultRange: 'See panel', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'BP', testName: 'Blood Pressure Monitoring', category: 'Vital Signs', defaultUnit: 'mmHg', defaultRange: '<120/80', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'ABG', testName: 'Arterial Blood Gas', category: 'Chemistry', defaultUnit: 'mmHg', defaultRange: 'pH 7.35-7.45', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'CXR', testName: 'Chest X-Ray', category: 'Radiology', defaultUnit: 'N/A', defaultRange: 'Normal', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'XRAY-KNEE', testName: 'X-Ray - Bilateral Knees', category: 'Radiology', defaultUnit: 'N/A', defaultRange: 'Normal', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'MP', testName: 'Malaria Parasite', category: 'Microbiology', defaultUnit: 'N/A', defaultRange: 'Negative', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'WIDAL', testName: 'Widal Test', category: 'Serology', defaultUnit: 'titre', defaultRange: '<1:80', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'URINE', testName: 'Urinalysis', category: 'Microbiology', defaultUnit: 'N/A', defaultRange: 'Normal', criticalLow: undefined, criticalHigh: undefined },
  { testCode: 'ESR', testName: 'Erythrocyte Sedimentation Rate', category: 'Haematology', defaultUnit: 'mm/hr', defaultRange: '0-20', criticalLow: undefined, criticalHigh: 100 },
];

export const updateTestCatalog = (testCode: string, updates: Partial<TestCatalogEntry>): TestCatalogEntry | undefined => {
  const index = testCatalog.findIndex(t => t.testCode === testCode);
  if (index === -1) return undefined;
  testCatalog[index] = { ...testCatalog[index], ...updates };
  return testCatalog[index];
};

export const addTestCatalogEntry = (entry: TestCatalogEntry): TestCatalogEntry => {
  testCatalog.push(entry);
  return entry;
};

export const getTestCatalogEntry = (testCode: string): TestCatalogEntry | undefined =>
  testCatalog.find(t => t.testCode === testCode);

export const deleteTestCatalogEntry = (testCode: string): boolean => {
  const index = testCatalog.findIndex(t => t.testCode === testCode);
  if (index === -1) return false;
  testCatalog.splice(index, 1);
  return true;
};

export const mockLabOrders: LabOrder[] = [
  {
    id: 'lab-001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    tests: [
      { testCode: 'BP', testName: 'Blood Pressure Monitoring', result: '140/90 mmHg', normalRange: '<120/80 mmHg', isAbnormal: true, techNotes: 'Repeated measurement confirmed elevated BP' },
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
      { testCode: 'FBS', testName: 'Fasting Blood Sugar', result: '156 mg/dL', normalRange: '70-100 mg/dL', unit: 'mg/dL', isAbnormal: true, techNotes: 'Fasting confirmed by patient - 12hr fast' },
      { testCode: 'HBA1C', testName: 'HbA1c', result: '7.2%', normalRange: '<5.7%', unit: '%', isAbnormal: true, techNotes: 'Sample processed within 2 hours of collection' },
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

export const getLabOrderById = (id: string): LabOrder | undefined =>
  mockLabOrders.find(o => o.id === id);

export const updateLabOrderStatus = (id: string, status: LabOrder['status']): LabOrder | undefined => {
  const order = mockLabOrders.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (status === 'sample_collected') order.collectedAt = new Date().toISOString();
    if (status === 'completed') order.completedAt = new Date().toISOString();
  }
  return order;
};

export const updateLabOrder = (id: string, updates: Partial<LabOrder>): LabOrder | undefined => {
  const order = mockLabOrders.find(o => o.id === id);
  if (order) {
    Object.assign(order, updates);
  }
  return order;
};

export const submitLabOrderToDoctor = (id: string): LabOrder | undefined => {
  const order = mockLabOrders.find(o => o.id === id);
  if (order) {
    order.isSubmittedToDoctor = true;
    order.submittedAt = new Date().toISOString();
  }
  return order;
};

export const updateLabTestResults = (orderId: string, testCode: string, updates: Partial<import('@/types/clinical.types').LabTest>): LabOrder | undefined => {
  const order = mockLabOrders.find(o => o.id === orderId);
  if (order) {
    const test = order.tests.find(t => t.testCode === testCode);
    if (test) {
      Object.assign(test, updates);
    }
  }
  return order;
};

export const createLabOrder = (data: Omit<LabOrder, 'id' | 'orderedAt'>): LabOrder => {
  const labOrder: LabOrder = {
    ...data,
    id: `lab-${String(mockLabOrders.length + 1).padStart(3, '0')}`,
    orderedAt: new Date().toISOString(),
  };
  mockLabOrders.push(labOrder);
  return labOrder;
};
