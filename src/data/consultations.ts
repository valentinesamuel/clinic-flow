// Mock Consultations Data

import { Consultation } from '@/types/clinical.types';
import { AmendmentReason, ConsultationFormData } from '@/types/consultation.types';

export const mockConsultations: Consultation[] = [
  {
    id: 'con-001',
    patientId: 'pat-001',
    doctorId: 'usr-004',
    appointmentId: 'apt-001',
    chiefComplaint: 'Blood pressure follow-up and routine check',
    historyOfPresentIllness: 'Patient reports occasional headaches in the morning, especially after stressful work days. Has been compliant with medication. No chest pain, palpitations, or shortness of breath.',
    physicalExamination: 'BP 140/90 mmHg, HR 78 bpm regular. General appearance healthy. Heart sounds normal, no murmurs. Lungs clear bilaterally. No pedal edema.',
    diagnosis: ['Essential hypertension', 'Stress-related tension headaches'],
    icdCodes: ['I10', 'G44.2'],
    treatmentPlan: 'Continue Lisinopril 10mg daily. Add lifestyle modifications: reduce salt intake, increase physical activity. Return in 4 weeks for BP monitoring.',
    prescriptionId: 'rx-001',
    labOrderIds: ['lab-001'],
    followUpDate: '2024-03-01',
    status: 'finalized',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    versions: [],
    currentVersion: 1,
  },
  {
    id: 'con-002',
    patientId: 'pat-001',
    doctorId: 'usr-004',
    appointmentId: 'apt-002',
    chiefComplaint: 'Routine diabetes screening',
    historyOfPresentIllness: 'Annual check-up. Family history of type 2 diabetes (mother). No polydipsia, polyuria, or unexplained weight loss.',
    physicalExamination: 'Weight stable at 72kg. BMI 26.4 (overweight). BP 138/88 mmHg. Foot examination normal, no neuropathy signs.',
    diagnosis: ['Pre-diabetes risk assessment', 'Overweight'],
    icdCodes: ['R73.03', 'E66.9'],
    treatmentPlan: 'Order fasting blood glucose and HbA1c. Diet and exercise counseling provided. Weight loss goal: 5kg over 6 months.',
    labOrderIds: ['lab-002'],
    followUpDate: '2024-01-20',
    status: 'finalized',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-05T11:30:00Z',
    versions: [],
    currentVersion: 1,
  },
  {
    id: 'con-003',
    patientId: 'pat-002',
    doctorId: 'usr-004',
    appointmentId: 'apt-003',
    chiefComplaint: 'Diabetes follow-up',
    historyOfPresentIllness: 'Known Type 2 diabetic for 5 years. Currently on Metformin 1000mg BD. Reports good compliance. Occasional numbness in feet.',
    physicalExamination: 'BP 128/82 mmHg. Weight 88kg. Foot examination shows decreased sensation to monofilament testing. No ulcers or lesions.',
    diagnosis: ['Type 2 diabetes mellitus with peripheral neuropathy'],
    icdCodes: ['E11.42'],
    treatmentPlan: 'Continue Metformin. Add Pregabalin 75mg at night for neuropathy. Refer to ophthalmology for diabetic eye screening.',
    prescriptionId: 'rx-002',
    labOrderIds: ['lab-003'],
    followUpDate: '2024-02-28',
    status: 'finalized',
    createdAt: '2024-01-28T14:00:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
    versions: [],
    currentVersion: 1,
  },
  {
    id: 'con-004',
    patientId: 'pat-003',
    doctorId: 'doc-002',
    appointmentId: 'apt-004',
    chiefComplaint: 'Upper respiratory tract infection',
    historyOfPresentIllness: 'Patient presents with 3-day history of sore throat, runny nose, and mild cough. No fever, no difficulty breathing. No known sick contacts.',
    physicalExamination: 'Temp 36.9°C. Pharynx mildly erythematous. No tonsillar exudates. Lungs clear. No lymphadenopathy.',
    diagnosis: ['Acute viral upper respiratory infection'],
    icdCodes: ['J06.9'],
    treatmentPlan: 'Symptomatic treatment. Paracetamol PRN for throat pain. Increase fluid intake. Return if symptoms worsen or fever develops.',
    prescriptionId: 'rx-003',
    labOrderIds: [],
    status: 'finalized',
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
    versions: [],
    currentVersion: 1,
  },
  {
    id: 'con-005',
    patientId: 'pat-004',
    doctorId: 'doc-003',
    appointmentId: 'apt-005',
    chiefComplaint: 'Knee pain and hypertension follow-up',
    historyOfPresentIllness: 'Patient complains of bilateral knee pain for 2 months, worse on climbing stairs. Has history of hypertension, not well controlled on current regimen.',
    physicalExamination: 'BP 145/92 mmHg. BMI 27. Knees show crepitus on flexion/extension. No joint effusion. Range of motion mildly limited.',
    diagnosis: ['Osteoarthritis of both knees', 'Uncontrolled essential hypertension'],
    icdCodes: ['M17.0', 'I10'],
    treatmentPlan: 'Add Amlodipine 5mg to current antihypertensive regimen. Paracetamol 1g TDS for knee pain. Refer to physiotherapy. Weight reduction advised.',
    prescriptionId: 'rx-004',
    labOrderIds: ['lab-004'],
    followUpDate: '2024-02-15',
    status: 'finalized',
    createdAt: '2024-02-01T15:30:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
    versions: [],
    currentVersion: 1,
  },
  {
    id: 'con-006',
    patientId: 'pat-005',
    doctorId: 'doc-002',
    appointmentId: 'apt-006',
    chiefComplaint: 'Acute asthma exacerbation',
    historyOfPresentIllness: 'EMERGENCY: 14-year-old known asthmatic presenting with acute shortness of breath and wheezing for 2 hours. Triggered by dust exposure at school. Used inhaler 4 times without relief.',
    physicalExamination: 'Temp 37.2°C, RR 28/min, O2 Sat 89% on room air, HR 110 bpm. Bilateral expiratory wheeze. Using accessory muscles. Can speak in short sentences.',
    diagnosis: ['Acute severe asthma exacerbation'],
    icdCodes: ['J45.21'],
    treatmentPlan: 'URGENT: Nebulized salbutamol + ipratropium started. Prednisolone 40mg given. O2 via nasal cannula. Monitor closely. If no improvement in 1 hour, consider IV magnesium and ICU referral.',
    prescriptionId: 'rx-005',
    labOrderIds: [],
    status: 'finalized',
    createdAt: '2024-02-02T08:45:00Z',
    updatedAt: '2024-02-02T08:45:00Z',
    versions: [],
    currentVersion: 1,
  },
];

// Get consultations by patient ID
export const getConsultationsByPatient = (patientId: string): Consultation[] => 
  mockConsultations
    .filter(c => c.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

// Get recent consultations with limit
export const getRecentConsultations = (patientId: string, limit: number = 5): Consultation[] => 
  getConsultationsByPatient(patientId).slice(0, limit);

// Get consultation by ID
export const getConsultationById = (id: string): Consultation | undefined => 
  mockConsultations.find(c => c.id === id);

// Get all consultations for a doctor
export const getConsultationsByDoctor = (doctorId: string): Consultation[] => 
  mockConsultations.filter(c => c.doctorId === doctorId);

// Create a new consultation
export const createConsultation = (data: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'currentVersion'>): Consultation => {
  const consultation: Consultation = {
    ...data,
    id: `con-${String(mockConsultations.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
    currentVersion: 1,
  };
  mockConsultations.push(consultation);
  return consultation;
};

// Update an existing consultation
export const updateConsultation = (id: string, updates: Partial<Consultation>): Consultation | undefined => {
  const index = mockConsultations.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  mockConsultations[index] = {
    ...mockConsultations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockConsultations[index];
};

// Amend a finalized consultation — snapshots current state, applies new data
export const amendConsultation = (
  id: string,
  newFormData: ConsultationFormData,
  reason: AmendmentReason,
  reasonDetail: string | undefined,
  amendedBy: string,
  amendedByName: string,
): Consultation | undefined => {
  const index = mockConsultations.findIndex(c => c.id === id);
  if (index === -1) return undefined;

  const current = mockConsultations[index];

  // Snapshot current state
  const snapshot: ConsultationFormData = {
    chiefComplaint: current.chiefComplaint,
    historyOfPresentIllness: current.historyOfPresentIllness,
    physicalExamination: current.physicalExamination,
    selectedDiagnoses: current.diagnosis.map((desc, i) => ({
      code: current.icdCodes[i] || '',
      description: desc,
      isPrimary: i === 0,
    })),
    treatmentPlan: current.treatmentPlan,
    prescriptionItems: [],
    labOrders: [],
    followUpDate: current.followUpDate || null,
    notes: '',
    bundleDeselections: [],
    justifications: [],
  };

  const version = {
    version: current.currentVersion,
    amendedAt: new Date().toISOString(),
    amendedBy,
    amendedByName,
    reason,
    reasonDetail,
    snapshot,
  };

  mockConsultations[index] = {
    ...current,
    chiefComplaint: newFormData.chiefComplaint,
    historyOfPresentIllness: newFormData.historyOfPresentIllness,
    physicalExamination: newFormData.physicalExamination,
    diagnosis: newFormData.selectedDiagnoses.map(d => d.description),
    icdCodes: newFormData.selectedDiagnoses.map(d => d.code),
    treatmentPlan: newFormData.treatmentPlan,
    followUpDate: newFormData.followUpDate || undefined,
    versions: [...current.versions, version],
    currentVersion: current.currentVersion + 1,
    updatedAt: new Date().toISOString(),
  };

  return mockConsultations[index];
};

// Get consultations within date range
export const getConsultationsInRange = (
  patientId: string,
  startDate: Date,
  endDate: Date
): Consultation[] =>
  mockConsultations.filter(c => {
    const date = new Date(c.createdAt);
    return c.patientId === patientId && date >= startDate && date <= endDate;
  });
