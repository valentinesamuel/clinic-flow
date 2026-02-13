// Mock Prescriptions Data

import { Prescription, DispensedItem, DispenseAuditEntry } from '@/types/clinical.types';

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    visitId: 'vis-001',
    items: [
      {
        drugName: 'Lisinopril 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the morning with water',
      },
      {
        drugName: 'Amlodipine 5mg',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take at bedtime',
      },
    ],
    status: 'dispensed',
    prescribedAt: '2024-02-01T10:30:00Z',
    dispensedAt: '2024-02-01T11:00:00Z',
    dispensedBy: 'phm-001',
    notes: 'Continue current BP medication regime',
    dispensedItems: [
      {
        drugName: 'Lisinopril 10mg',
        prescribedQuantity: 30,
        dispensedQuantity: 30,
        isSubstituted: false,
      },
      {
        drugName: 'Amlodipine 5mg',
        prescribedQuantity: 30,
        dispensedQuantity: 30,
        isSubstituted: false,
      },
    ],
    auditLog: [
      {
        id: 'audit-001-1',
        action: 'dispensed',
        prescriptionId: 'rx-001',
        itemDrugName: 'Lisinopril 10mg',
        details: 'Dispensed 30 of 30 Lisinopril 10mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T11:00:00Z',
      },
      {
        id: 'audit-001-2',
        action: 'dispensed',
        prescriptionId: 'rx-001',
        itemDrugName: 'Amlodipine 5mg',
        details: 'Dispensed 30 of 30 Amlodipine 5mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T11:00:00Z',
      },
      {
        id: 'audit-001-3',
        action: 'dispensed',
        prescriptionId: 'rx-001',
        itemDrugName: '',
        details: 'All 2 items fully dispensed',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T11:00:00Z',
      },
    ],
  },
  {
    id: 'rx-002',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    visitId: 'vis-002',
    items: [
      {
        drugName: 'Metformin 500mg',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take with meals to reduce stomach upset',
      },
    ],
    status: 'dispensed',
    prescribedAt: '2024-02-01T12:00:00Z',
    dispensedAt: '2024-02-01T12:30:00Z',
    dispensedBy: 'phm-001',
    dispensedItems: [
      {
        drugName: 'Metformin 500mg',
        dispensedDrugName: 'Glucophage 500mg',
        substitutionType: 'generic',
        substitutionReason: 'Original brand out of stock',
        prescribedQuantity: 60,
        dispensedQuantity: 60,
        isSubstituted: true,
      },
    ],
    auditLog: [
      {
        id: 'audit-002-1',
        action: 'substituted',
        prescriptionId: 'rx-002',
        itemDrugName: 'Metformin 500mg',
        details: 'Substituted Metformin 500mg with Glucophage 500mg (generic). Reason: Original brand out of stock',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T12:30:00Z',
      },
      {
        id: 'audit-002-2',
        action: 'dispensed',
        prescriptionId: 'rx-002',
        itemDrugName: 'Glucophage 500mg',
        details: 'Dispensed 60 of 60 Glucophage 500mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T12:30:00Z',
      },
      {
        id: 'audit-002-3',
        action: 'dispensed',
        prescriptionId: 'rx-002',
        itemDrugName: '',
        details: 'All 1 items fully dispensed',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T12:30:00Z',
      },
    ],
  },
  {
    id: 'rx-003',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    visitId: 'vis-004',
    items: [
      {
        drugName: 'Diclofenac 50mg',
        dosage: '50mg',
        frequency: 'Twice daily',
        duration: '14 days',
        quantity: 28,
        instructions: 'Take after meals. Do not take on empty stomach.',
      },
      {
        drugName: 'Omeprazole 20mg',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '14 days',
        quantity: 14,
        instructions: 'Take 30 minutes before breakfast',
      },
      {
        drugName: 'Glucosamine Sulphate 500mg',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '30 days',
        quantity: 90,
        instructions: 'Take with meals',
      },
    ],
    status: 'dispensed',
    prescribedAt: '2024-02-01T16:00:00Z',
    dispensedAt: '2024-02-01T16:30:00Z',
    dispensedBy: 'phm-001',
    notes: 'For arthritis pain management',
    dispensedItems: [
      {
        drugName: 'Diclofenac 50mg',
        prescribedQuantity: 28,
        dispensedQuantity: 28,
        isSubstituted: false,
      },
      {
        drugName: 'Omeprazole 20mg',
        prescribedQuantity: 14,
        dispensedQuantity: 14,
        isSubstituted: false,
      },
      {
        drugName: 'Glucosamine Sulphate 500mg',
        prescribedQuantity: 90,
        dispensedQuantity: 90,
        isSubstituted: false,
      },
    ],
    auditLog: [
      {
        id: 'audit-003-1',
        action: 'dispensed',
        prescriptionId: 'rx-003',
        itemDrugName: 'Diclofenac 50mg',
        details: 'Dispensed 28 of 28 Diclofenac 50mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T16:30:00Z',
      },
      {
        id: 'audit-003-2',
        action: 'dispensed',
        prescriptionId: 'rx-003',
        itemDrugName: 'Omeprazole 20mg',
        details: 'Dispensed 14 of 14 Omeprazole 20mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T16:30:00Z',
      },
      {
        id: 'audit-003-3',
        action: 'dispensed',
        prescriptionId: 'rx-003',
        itemDrugName: 'Glucosamine Sulphate 500mg',
        details: 'Dispensed 90 of 90 Glucosamine Sulphate 500mg',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T16:30:00Z',
      },
      {
        id: 'audit-003-4',
        action: 'dispensed',
        prescriptionId: 'rx-003',
        itemDrugName: '',
        details: 'All 3 items fully dispensed',
        performedBy: 'phm-001',
        performedByName: 'Pharm. Janet Okonkwo',
        performedAt: '2024-02-01T16:30:00Z',
      },
    ],
  },
  {
    id: 'rx-004',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    visitId: 'vis-005',
    items: [
      {
        drugName: 'Ventolin Inhaler',
        dosage: '100mcg',
        frequency: 'As needed',
        duration: 'PRN',
        quantity: 1,
        instructions: '2 puffs when having breathing difficulty. Maximum 8 puffs in 24 hours.',
      },
      {
        drugName: 'Prednisolone 5mg',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '5 days',
        quantity: 25,
        instructions: 'Take 5 tablets (25mg) in the morning for 5 days',
      },
      {
        drugName: 'Montelukast 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take at bedtime',
      },
    ],
    status: 'pending',
    prescribedAt: '2024-02-02T09:00:00Z',
    notes: 'Emergency prescription for acute asthma exacerbation',
  },
  {
    id: 'rx-005',
    patientId: 'pat-007',
    patientName: 'Blessing Igwe',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    visitId: 'vis-007',
    items: [
      {
        drugName: 'Sumatriptan 50mg',
        dosage: '50mg',
        frequency: 'As needed',
        duration: 'PRN',
        quantity: 6,
        instructions: 'Take at onset of migraine. Do not exceed 2 tablets in 24 hours.',
      },
    ],
    status: 'pending',
    prescribedAt: '2024-02-02T10:00:00Z',
    notes: 'For acute migraine treatment',
  },
];

export const getPendingPrescriptions = (): Prescription[] => 
  mockPrescriptions.filter(p => p.status === 'pending');

export const getPrescriptionsByPatient = (patientId: string): Prescription[] => 
  mockPrescriptions.filter(p => p.patientId === patientId);

export const getPrescriptionsByDoctor = (doctorId: string): Prescription[] => 
  mockPrescriptions.filter(p => p.doctorId === doctorId);

export const getTodaysPrescriptions = (): Prescription[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockPrescriptions.filter(p => p.prescribedAt.startsWith(today));
};

export const getPrescriptionById = (id: string): Prescription | undefined =>
  mockPrescriptions.find(p => p.id === id);

export const createPrescription = (data: Omit<Prescription, 'id' | 'prescribedAt'>): Prescription => {
  const prescription: Prescription = {
    ...data,
    id: `rx-${String(mockPrescriptions.length + 1).padStart(3, '0')}`,
    prescribedAt: new Date().toISOString(),
  };
  mockPrescriptions.push(prescription);
  return prescription;
};

export const dispensePrescription = (
  id: string,
  dispensedItems: DispensedItem[],
  dispensedById: string,
  dispensedByName: string
): Prescription | undefined => {
  const prescription = mockPrescriptions.find(p => p.id === id);
  if (!prescription) return undefined;

  // Determine if fully or partially dispensed
  const allFullyDispensed = dispensedItems.every(
    item => item.dispensedQuantity >= item.prescribedQuantity
  );
  const prescribedCount = prescription.items.length;
  const dispensedCount = dispensedItems.length;

  prescription.status = (allFullyDispensed && dispensedCount >= prescribedCount)
    ? 'dispensed'
    : 'partially_dispensed';
  prescription.dispensedItems = dispensedItems;
  prescription.dispensedAt = new Date().toISOString();
  prescription.dispensedBy = dispensedById;

  // Create audit entries
  if (!prescription.auditLog) prescription.auditLog = [];

  for (const item of dispensedItems) {
    if (item.isSubstituted) {
      prescription.auditLog.push({
        id: `audit-${Date.now()}-sub-${item.drugName}`,
        action: 'substituted',
        prescriptionId: id,
        itemDrugName: item.drugName,
        details: `Substituted ${item.drugName} with ${item.dispensedDrugName} (${item.substitutionType}). Reason: ${item.substitutionReason}`,
        performedBy: dispensedById,
        performedByName: dispensedByName,
        performedAt: new Date().toISOString(),
      });
    }

    prescription.auditLog.push({
      id: `audit-${Date.now()}-disp-${item.drugName}`,
      action: 'dispensed',
      prescriptionId: id,
      itemDrugName: item.dispensedDrugName || item.drugName,
      details: `Dispensed ${item.dispensedQuantity} of ${item.prescribedQuantity} ${item.dispensedDrugName || item.drugName}`,
      performedBy: dispensedById,
      performedByName: dispensedByName,
      performedAt: new Date().toISOString(),
    });
  }

  // Add overall status entry
  prescription.auditLog.push({
    id: `audit-${Date.now()}-status`,
    action: prescription.status === 'dispensed' ? 'dispensed' : 'partially_dispensed',
    prescriptionId: id,
    itemDrugName: '',
    details: prescription.status === 'dispensed'
      ? `All ${dispensedCount} items fully dispensed`
      : `${dispensedCount} of ${prescribedCount} items dispensed`,
    performedBy: dispensedById,
    performedByName: dispensedByName,
    performedAt: new Date().toISOString(),
  });

  return prescription;
};
