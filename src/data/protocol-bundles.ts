import { ProtocolBundle } from '@/types/financial.types';

export const PROTOCOL_BUNDLES: ProtocolBundle[] = [
  {
    id: 'bundle-malaria',
    name: 'Standard Malaria Bundle',
    description: 'Standard workup and treatment for uncomplicated malaria',
    icd10Codes: ['B50', 'B51', 'B52', 'B53', 'B54'],
    labTests: [
      { testCode: 'lab-002', testName: 'Malaria Parasite (MP)', priority: 'urgent' },
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Artemether/Lumefantrine', dosage: '80/480mg', frequency: 'Twice daily', duration: '3 days', quantity: 12, instructions: 'Take with fatty food' },
      { drugName: 'Paracetamol 500mg x 10', dosage: '1000mg', frequency: 'Three times daily', duration: '3 days', quantity: 9, instructions: 'Take for fever and body aches' },
    ],
  },
  {
    id: 'bundle-typhoid',
    name: 'Typhoid Fever Bundle',
    description: 'Investigation and treatment for suspected typhoid fever',
    icd10Codes: ['A01'],
    labTests: [
      { testCode: 'lab-009', testName: 'Widal Test', priority: 'urgent' },
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
      { testCode: 'lab-004', testName: 'Liver Function Test (LFT)', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Ciprofloxacin 500mg x 10', dosage: '500mg', frequency: 'Twice daily', duration: '14 days', quantity: 28, instructions: 'Complete full course' },
      { drugName: 'Paracetamol 500mg x 10', dosage: '1000mg', frequency: 'Three times daily', duration: '5 days', quantity: 15, instructions: 'Take for fever' },
    ],
  },
  {
    id: 'bundle-uti',
    name: 'Urinary Tract Infection Bundle',
    description: 'Investigation and treatment for uncomplicated UTI',
    icd10Codes: ['N39.0'],
    labTests: [
      { testCode: 'lab-003', testName: 'Urinalysis', priority: 'urgent' },
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Ciprofloxacin 500mg x 10', dosage: '500mg', frequency: 'Twice daily', duration: '7 days', quantity: 14, instructions: 'Take with plenty of water' },
      { drugName: 'Paracetamol 500mg x 10', dosage: '1000mg', frequency: 'Three times daily', duration: '3 days', quantity: 9, instructions: 'Take for pain relief' },
    ],
  },
  {
    id: 'bundle-diabetes',
    name: 'Diabetes Monitoring Bundle',
    description: 'Routine monitoring for Type 2 Diabetes Mellitus',
    icd10Codes: ['E11', 'E10'],
    labTests: [
      { testCode: 'lab-006', testName: 'Fasting Blood Sugar (FBS)', priority: 'routine' },
      { testCode: 'lab-007', testName: 'HbA1c', priority: 'routine' },
      { testCode: 'lab-005', testName: 'Kidney Function Test (KFT)', priority: 'routine' },
      { testCode: 'lab-008', testName: 'Lipid Profile', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Metformin 500mg x 30', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', quantity: 60, instructions: 'Take with meals' },
    ],
  },
  {
    id: 'bundle-hypertension',
    name: 'Hypertension Workup Bundle',
    description: 'Initial workup and treatment for hypertension',
    icd10Codes: ['I10', 'I11'],
    labTests: [
      { testCode: 'lab-005', testName: 'Kidney Function Test (KFT)', priority: 'routine' },
      { testCode: 'lab-008', testName: 'Lipid Profile', priority: 'routine' },
      { testCode: 'lab-019', testName: 'ECG', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Amlodipine 5mg x 30', dosage: '5mg', frequency: 'Once daily', duration: '30 days', quantity: 30, instructions: 'Take in the morning' },
      { drugName: 'Lisinopril 10mg x 30', dosage: '10mg', frequency: 'Once daily', duration: '30 days', quantity: 30, instructions: 'Monitor blood pressure regularly' },
    ],
  },
  {
    id: 'bundle-gastroenteritis',
    name: 'Acute Gastroenteritis Bundle',
    description: 'Treatment for acute diarrhea and vomiting',
    icd10Codes: ['A09', 'K52'],
    labTests: [
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
      { testCode: 'lab-003', testName: 'Urinalysis', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Metformin 500mg x 30', dosage: 'ORS sachet', frequency: 'After each stool', duration: '3 days', quantity: 10, instructions: 'Dissolve in 200ml water' },
      { drugName: 'Ciprofloxacin 500mg x 10', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', quantity: 10, instructions: 'Take if symptoms persist' },
    ],
  },
  {
    id: 'bundle-urti',
    name: 'Upper Respiratory Infection Bundle',
    description: 'Treatment for common cold and upper respiratory infections',
    icd10Codes: ['J06.9', 'J00'],
    labTests: [
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Amoxicillin 500mg x 21', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', quantity: 21, instructions: 'Complete full course' },
      { drugName: 'Paracetamol 500mg x 10', dosage: '1000mg', frequency: 'Three times daily', duration: '5 days', quantity: 15, instructions: 'Take for fever and pain' },
      { drugName: 'Vitamin C 1000mg x 30', dosage: '1000mg', frequency: 'Once daily', duration: '14 days', quantity: 14, instructions: 'Take after meals' },
    ],
  },
  {
    id: 'bundle-pud',
    name: 'Peptic Ulcer Disease Bundle',
    description: 'Investigation and treatment for peptic ulcer disease',
    icd10Codes: ['K25', 'K26', 'K27'],
    labTests: [
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Omeprazole 20mg x 14', dosage: '20mg', frequency: 'Twice daily', duration: '14 days', quantity: 28, instructions: 'Take 30 minutes before meals' },
      { drugName: 'Amoxicillin 500mg x 21', dosage: '1000mg', frequency: 'Twice daily', duration: '14 days', quantity: 28, instructions: 'Part of triple therapy' },
    ],
  },
  {
    id: 'bundle-anemia',
    name: 'Anemia Workup Bundle',
    description: 'Investigation and treatment for iron deficiency anemia',
    icd10Codes: ['D50', 'D64'],
    labTests: [
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'urgent' },
      { testCode: 'lab-014', testName: 'Blood Group & Genotype', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Ibuprofen 400mg x 10', dosage: '200mg elemental iron', frequency: 'Three times daily', duration: '90 days', quantity: 270, instructions: 'Take on empty stomach with Vitamin C' },
      { drugName: 'Multivitamins x 30', dosage: '5mg', frequency: 'Once daily', duration: '90 days', quantity: 90, instructions: 'Take with iron supplement' },
      { drugName: 'Vitamin C 1000mg x 30', dosage: '1000mg', frequency: 'Once daily', duration: '90 days', quantity: 90, instructions: 'Helps iron absorption' },
    ],
  },
  {
    id: 'bundle-pregnancy',
    name: 'Pregnancy Booking Bundle',
    description: 'Routine investigations for antenatal booking visit',
    icd10Codes: ['Z34'],
    labTests: [
      { testCode: 'lab-001', testName: 'Full Blood Count (FBC)', priority: 'routine' },
      { testCode: 'lab-003', testName: 'Urinalysis', priority: 'routine' },
      { testCode: 'lab-010', testName: 'HIV Screening', priority: 'routine' },
      { testCode: 'lab-011', testName: 'Hepatitis B Surface Antigen', priority: 'routine' },
      { testCode: 'lab-014', testName: 'Blood Group & Genotype', priority: 'routine' },
    ],
    medications: [
      { drugName: 'Multivitamins x 30', dosage: '5mg', frequency: 'Once daily', duration: 'Throughout pregnancy', quantity: 30, instructions: 'Take daily' },
      { drugName: 'Ibuprofen 400mg x 10', dosage: '200mg elemental iron', frequency: 'Once daily', duration: 'Throughout pregnancy', quantity: 30, instructions: 'Take with Vitamin C for better absorption' },
    ],
  },
];

export function getBundlesForDiagnosis(icd10Code: string): ProtocolBundle[] {
  return PROTOCOL_BUNDLES.filter(bundle =>
    bundle.icd10Codes.some(code => icd10Code.startsWith(code))
  );
}

export function getBundleById(id: string): ProtocolBundle | undefined {
  return PROTOCOL_BUNDLES.find(bundle => bundle.id === id);
}
