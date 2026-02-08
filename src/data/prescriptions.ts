// Mock Prescriptions Data

import { Prescription } from '@/types/clinical.types';

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
    dispensedBy: 'usr-008',
    notes: 'Continue current BP medication regime',
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
    dispensedBy: 'usr-008',
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
    dispensedBy: 'usr-008',
    notes: 'For arthritis pain management',
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

export const createPrescription = (data: Omit<Prescription, 'id' | 'prescribedAt'>): Prescription => {
  const prescription: Prescription = {
    ...data,
    id: `rx-${String(mockPrescriptions.length + 1).padStart(3, '0')}`,
    prescribedAt: new Date().toISOString(),
  };
  mockPrescriptions.push(prescription);
  return prescription;
};
