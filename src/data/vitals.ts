// Mock Vitals Data

import { VitalSigns } from '@/types/clinical.types';

export const mockVitals: VitalSigns[] = [
  {
    id: 'vit-001',
    patientId: 'pat-001',
    recordedBy: 'usr-005',
    recordedAt: '2024-02-01T09:15:00Z',
    bloodPressureSystolic: 140,
    bloodPressureDiastolic: 90,
    temperature: 36.8,
    pulse: 78,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 72,
    height: 165,
    bmi: 26.4,
    notes: 'BP slightly elevated. Patient reports stress at work.',
  },
  {
    id: 'vit-002',
    patientId: 'pat-002',
    recordedBy: 'usr-005',
    recordedAt: '2024-02-01T09:45:00Z',
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    temperature: 36.6,
    pulse: 72,
    respiratoryRate: 14,
    oxygenSaturation: 99,
    weight: 88,
    height: 175,
    bmi: 28.7,
    notes: 'Weight stable from last visit.',
  },
  {
    id: 'vit-003',
    patientId: 'pat-003',
    recordedBy: 'usr-005',
    recordedAt: '2024-02-01T14:15:00Z',
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    temperature: 36.9,
    pulse: 68,
    respiratoryRate: 15,
    oxygenSaturation: 99,
    weight: 58,
    height: 162,
    bmi: 22.1,
  },
  {
    id: 'vit-004',
    patientId: 'pat-004',
    recordedBy: 'usr-005',
    recordedAt: '2024-02-01T15:00:00Z',
    bloodPressureSystolic: 145,
    bloodPressureDiastolic: 92,
    temperature: 36.7,
    pulse: 82,
    respiratoryRate: 18,
    oxygenSaturation: 97,
    weight: 78,
    height: 170,
    bmi: 27.0,
    notes: 'BP elevated. Knee pain reported - difficulty walking.',
  },
  {
    id: 'vit-005',
    patientId: 'pat-005',
    recordedBy: 'usr-005',
    recordedAt: '2024-02-02T08:35:00Z',
    bloodPressureSystolic: 110,
    bloodPressureDiastolic: 70,
    temperature: 37.2,
    pulse: 110,
    respiratoryRate: 28,
    oxygenSaturation: 89,
    weight: 32,
    height: 138,
    bmi: 16.8,
    notes: 'EMERGENCY - Acute respiratory distress. O2 sat low. Tachycardia. Started nebulization.',
  },
];

export const getVitalsByPatient = (patientId: string): VitalSigns[] => 
  mockVitals.filter(v => v.patientId === patientId);

export const getLatestVitals = (patientId: string): VitalSigns | undefined => {
  const patientVitals = getVitalsByPatient(patientId);
  return patientVitals.sort((a, b) => 
    new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  )[0];
};

export const getAbnormalVitals = (): VitalSigns[] => 
  mockVitals.filter(v => 
    v.bloodPressureSystolic > 140 ||
    v.bloodPressureDiastolic > 90 ||
    v.temperature > 38 ||
    v.temperature < 36 ||
    v.pulse > 100 ||
    v.pulse < 60 ||
    v.oxygenSaturation < 95 ||
    v.respiratoryRate > 20
  );

export const getTodaysVitals = (): VitalSigns[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockVitals.filter(v => v.recordedAt.startsWith(today));
};

// ID counter for new vitals
let vitalsIdCounter = mockVitals.length;

// Add new vitals record
export const addVitals = (vitals: Omit<VitalSigns, 'id'>): VitalSigns => {
  vitalsIdCounter++;
  const newVitals: VitalSigns = {
    ...vitals,
    id: `vit-${String(vitalsIdCounter).padStart(3, '0')}`,
  };
  mockVitals.push(newVitals);
  return newVitals;
};

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

// Get BMI category
export const getBMICategory = (bmi: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese' => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Check if vital is abnormal
export const isVitalAbnormal = (field: string, value: number): { abnormal: boolean; severity: 'warning' | 'critical' } => {
  const thresholds: Record<string, { warning: [number, number]; critical: [number, number] }> = {
    bloodPressureSystolic: { warning: [130, 140], critical: [140, 999] },
    bloodPressureDiastolic: { warning: [85, 90], critical: [90, 999] },
    temperature: { warning: [37.5, 38], critical: [38, 999] },
    pulse: { warning: [90, 100], critical: [100, 999] },
    oxygenSaturation: { warning: [93, 95], critical: [0, 93] },
    respiratoryRate: { warning: [18, 20], critical: [20, 999] },
  };

  const threshold = thresholds[field];
  if (!threshold) return { abnormal: false, severity: 'warning' };

  if (field === 'oxygenSaturation') {
    if (value <= threshold.critical[1]) return { abnormal: true, severity: 'critical' };
    if (value <= threshold.warning[1]) return { abnormal: true, severity: 'warning' };
  } else {
    if (value >= threshold.critical[0]) return { abnormal: true, severity: 'critical' };
    if (value >= threshold.warning[0]) return { abnormal: true, severity: 'warning' };
  }

  return { abnormal: false, severity: 'warning' };
};
