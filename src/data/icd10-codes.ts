// ICD-10 Codes Catalog - Common codes used in Nigerian clinics

export interface ICD10Code {
  code: string;
  description: string;
  category: string;
}

// Common ICD-10 codes organized by category
export const ICD10_CODES: ICD10Code[] = [
  // Infectious Diseases
  { code: 'A01.0', description: 'Typhoid fever', category: 'Infectious' },
  { code: 'A09.0', description: 'Gastroenteritis and colitis of infectious origin', category: 'Infectious' },
  { code: 'B50.9', description: 'Plasmodium falciparum malaria, unspecified', category: 'Infectious' },
  { code: 'B54', description: 'Malaria, unspecified', category: 'Infectious' },
  
  // Respiratory
  { code: 'J00', description: 'Acute nasopharyngitis (common cold)', category: 'Respiratory' },
  { code: 'J02.9', description: 'Acute pharyngitis, unspecified', category: 'Respiratory' },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Respiratory' },
  { code: 'J18.9', description: 'Pneumonia, unspecified', category: 'Respiratory' },
  { code: 'J45.20', description: 'Mild intermittent asthma, uncomplicated', category: 'Respiratory' },
  { code: 'J45.30', description: 'Mild persistent asthma, uncomplicated', category: 'Respiratory' },
  { code: 'J45.40', description: 'Moderate persistent asthma, uncomplicated', category: 'Respiratory' },
  { code: 'J45.50', description: 'Severe persistent asthma, uncomplicated', category: 'Respiratory' },
  
  // Cardiovascular
  { code: 'I10', description: 'Essential (primary) hypertension', category: 'Cardiovascular' },
  { code: 'I11.9', description: 'Hypertensive heart disease without heart failure', category: 'Cardiovascular' },
  { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery', category: 'Cardiovascular' },
  { code: 'I50.9', description: 'Heart failure, unspecified', category: 'Cardiovascular' },
  { code: 'I64', description: 'Stroke, not specified as haemorrhage or infarction', category: 'Cardiovascular' },
  
  // Endocrine/Metabolic
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine' },
  { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia', category: 'Endocrine' },
  { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications', category: 'Endocrine' },
  { code: 'E03.9', description: 'Hypothyroidism, unspecified', category: 'Endocrine' },
  { code: 'E05.90', description: 'Thyrotoxicosis, unspecified without thyrotoxic crisis', category: 'Endocrine' },
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified', category: 'Endocrine' },
  { code: 'E66.9', description: 'Obesity, unspecified', category: 'Endocrine' },
  
  // Gastrointestinal
  { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis', category: 'GI' },
  { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding', category: 'GI' },
  { code: 'K30', description: 'Functional dyspepsia', category: 'GI' },
  { code: 'K59.00', description: 'Constipation, unspecified', category: 'GI' },
  { code: 'K92.0', description: 'Hematemesis', category: 'GI' },
  
  // Musculoskeletal
  { code: 'M17.0', description: 'Bilateral primary osteoarthritis of knee', category: 'Musculoskeletal' },
  { code: 'M54.5', description: 'Low back pain', category: 'Musculoskeletal' },
  { code: 'M79.3', description: 'Panniculitis, unspecified', category: 'Musculoskeletal' },
  { code: 'M25.50', description: 'Pain in unspecified joint', category: 'Musculoskeletal' },
  
  // Neurological
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable', category: 'Neurological' },
  { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable', category: 'Neurological' },
  { code: 'G47.00', description: 'Insomnia, unspecified', category: 'Neurological' },
  
  // Mental Health
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified', category: 'Mental Health' },
  { code: 'F41.9', description: 'Anxiety disorder, unspecified', category: 'Mental Health' },
  { code: 'F51.01', description: 'Primary insomnia', category: 'Mental Health' },
  
  // Genitourinary
  { code: 'N39.0', description: 'Urinary tract infection, site not specified', category: 'Genitourinary' },
  { code: 'N40.0', description: 'Benign prostatic hyperplasia without lower urinary tract symptoms', category: 'Genitourinary' },
  { code: 'N18.9', description: 'Chronic kidney disease, unspecified', category: 'Genitourinary' },
  
  // Dermatological
  { code: 'L20.9', description: 'Atopic dermatitis, unspecified', category: 'Dermatology' },
  { code: 'L30.9', description: 'Dermatitis, unspecified', category: 'Dermatology' },
  { code: 'L50.9', description: 'Urticaria, unspecified', category: 'Dermatology' },
  
  // Obstetric/Gynecological
  { code: 'O80', description: 'Encounter for full-term uncomplicated delivery', category: 'Obstetric' },
  { code: 'N94.6', description: 'Dysmenorrhea, unspecified', category: 'Gynecological' },
  { code: 'N92.0', description: 'Excessive and frequent menstruation with regular cycle', category: 'Gynecological' },
  
  // Pediatric
  { code: 'P07.39', description: 'Preterm newborn, unspecified weeks of gestation', category: 'Pediatric' },
  { code: 'R50.9', description: 'Fever, unspecified', category: 'General' },
  
  // Injuries
  { code: 'S00.93XA', description: 'Unspecified superficial injury of head, initial encounter', category: 'Injury' },
  { code: 'S52.509A', description: 'Unspecified fracture of the lower end of unspecified radius, initial encounter', category: 'Injury' },
  { code: 'T14.90XA', description: 'Injury, unspecified, initial encounter', category: 'Injury' },
  
  // General/Symptoms
  { code: 'R05.9', description: 'Cough, unspecified', category: 'General' },
  { code: 'R06.02', description: 'Shortness of breath', category: 'General' },
  { code: 'R10.9', description: 'Unspecified abdominal pain', category: 'General' },
  { code: 'R11.2', description: 'Nausea with vomiting, unspecified', category: 'General' },
  { code: 'R51.9', description: 'Headache, unspecified', category: 'General' },
  { code: 'R53.83', description: 'Other fatigue', category: 'General' },
  { code: 'R63.4', description: 'Abnormal weight loss', category: 'General' },
  
  // Eye
  { code: 'H10.9', description: 'Unspecified conjunctivitis', category: 'Eye' },
  { code: 'H52.4', description: 'Presbyopia', category: 'Eye' },
  
  // ENT
  { code: 'H66.90', description: 'Otitis media, unspecified, unspecified ear', category: 'ENT' },
  { code: 'J01.90', description: 'Acute sinusitis, unspecified', category: 'ENT' },
  { code: 'J32.9', description: 'Chronic sinusitis, unspecified', category: 'ENT' },
];

// Categories for grouping
export const ICD10_CATEGORIES = [
  'Infectious',
  'Respiratory',
  'Cardiovascular',
  'Endocrine',
  'GI',
  'Musculoskeletal',
  'Neurological',
  'Mental Health',
  'Genitourinary',
  'Dermatology',
  'Obstetric',
  'Gynecological',
  'Pediatric',
  'Injury',
  'General',
  'Eye',
  'ENT',
];

// Search ICD-10 codes
export function searchICD10(query: string): ICD10Code[] {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return ICD10_CODES.filter(
    (code) =>
      code.code.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery) ||
      code.category.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

// Get codes by category
export function getICD10ByCategory(category: string): ICD10Code[] {
  return ICD10_CODES.filter((code) => code.category === category);
}

// Get common codes (most frequently used)
export function getCommonICD10Codes(): ICD10Code[] {
  const commonCodes = ['B54', 'I10', 'E11.9', 'J06.9', 'R50.9', 'M54.5', 'N39.0', 'R51.9'];
  return ICD10_CODES.filter((code) => commonCodes.includes(code.code));
}

// Get code by exact match
export function getICD10ByCode(code: string): ICD10Code | undefined {
  return ICD10_CODES.find((c) => c.code === code);
}
