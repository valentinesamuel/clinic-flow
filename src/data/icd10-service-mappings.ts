import { ICD10ServiceMapping } from '@/types/financial.types';

/**
 * ICD-10 Diagnosis Code to Service Mappings
 *
 * Maps ICD-10 diagnosis codes to approved service IDs from the bill-items catalog.
 * Each mapping includes lab tests, pharmaceuticals, and consultation services
 * based on established clinical protocols.
 */
export const ICD10_SERVICE_MAPPINGS: ICD10ServiceMapping[] = [
  // Malaria (B50-B54)
  {
    id: 'map-malaria-b50',
    icd10Code: 'B50',
    icd10Description: 'Plasmodium falciparum malaria',
    approvedServiceIds: ['con-001', 'lab-002', 'lab-001', 'pha-012', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Malaria Parasite Test',
      'Full Blood Count',
      'Artemether-Lumefantrine',
      'Paracetamol'
    ],
    bundleId: 'bundle-malaria'
  },
  {
    id: 'map-malaria-b51',
    icd10Code: 'B51',
    icd10Description: 'Plasmodium vivax malaria',
    approvedServiceIds: ['con-001', 'lab-002', 'lab-001', 'pha-012', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Malaria Parasite Test',
      'Full Blood Count',
      'Artemether-Lumefantrine',
      'Paracetamol'
    ],
    bundleId: 'bundle-malaria'
  },
  {
    id: 'map-malaria-b52',
    icd10Code: 'B52',
    icd10Description: 'Plasmodium malariae malaria',
    approvedServiceIds: ['con-001', 'lab-002', 'lab-001', 'pha-012', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Malaria Parasite Test',
      'Full Blood Count',
      'Artemether-Lumefantrine',
      'Paracetamol'
    ],
    bundleId: 'bundle-malaria'
  },
  {
    id: 'map-malaria-b53',
    icd10Code: 'B53',
    icd10Description: 'Other parasitologically confirmed malaria',
    approvedServiceIds: ['con-001', 'lab-002', 'lab-001', 'pha-012', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Malaria Parasite Test',
      'Full Blood Count',
      'Artemether-Lumefantrine',
      'Paracetamol'
    ],
    bundleId: 'bundle-malaria'
  },
  {
    id: 'map-malaria-b54',
    icd10Code: 'B54',
    icd10Description: 'Unspecified malaria',
    approvedServiceIds: ['con-001', 'lab-002', 'lab-001', 'pha-012', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Malaria Parasite Test',
      'Full Blood Count',
      'Artemether-Lumefantrine',
      'Paracetamol'
    ],
    bundleId: 'bundle-malaria'
  },

  // Typhoid Fever (A01)
  {
    id: 'map-typhoid-a01',
    icd10Code: 'A01',
    icd10Description: 'Typhoid and paratyphoid fevers',
    approvedServiceIds: ['con-001', 'lab-009', 'lab-001', 'lab-004', 'pha-004', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Widal Test',
      'Full Blood Count',
      'Blood Culture',
      'Ciprofloxacin',
      'Paracetamol'
    ],
    bundleId: 'bundle-typhoid'
  },
  {
    id: 'map-typhoid-a01.0',
    icd10Code: 'A01.0',
    icd10Description: 'Typhoid fever',
    approvedServiceIds: ['con-001', 'lab-009', 'lab-001', 'lab-004', 'pha-004', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Widal Test',
      'Full Blood Count',
      'Blood Culture',
      'Ciprofloxacin',
      'Paracetamol'
    ],
    bundleId: 'bundle-typhoid'
  },
  {
    id: 'map-typhoid-a01.1',
    icd10Code: 'A01.1',
    icd10Description: 'Paratyphoid fever A',
    approvedServiceIds: ['con-001', 'lab-009', 'lab-001', 'lab-004', 'pha-004', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Widal Test',
      'Full Blood Count',
      'Blood Culture',
      'Ciprofloxacin',
      'Paracetamol'
    ],
    bundleId: 'bundle-typhoid'
  },

  // Urinary Tract Infection (N39.0)
  {
    id: 'map-uti-n39.0',
    icd10Code: 'N39.0',
    icd10Description: 'Urinary tract infection, site not specified',
    approvedServiceIds: ['con-001', 'lab-003', 'lab-001', 'pha-004', 'pha-001'],
    approvedServiceNames: [
      'General Consultation',
      'Urinalysis',
      'Full Blood Count',
      'Ciprofloxacin',
      'Paracetamol'
    ],
    bundleId: 'bundle-uti'
  },

  // Diabetes Mellitus
  {
    id: 'map-diabetes-e11',
    icd10Code: 'E11',
    icd10Description: 'Type 2 diabetes mellitus',
    approvedServiceIds: ['con-001', 'lab-006', 'lab-007', 'lab-005', 'lab-008', 'pha-005'],
    approvedServiceNames: [
      'General Consultation',
      'Fasting Blood Sugar',
      'Random Blood Sugar',
      'HbA1c',
      'Lipid Profile',
      'Metformin'
    ],
    bundleId: 'bundle-diabetes'
  },
  {
    id: 'map-diabetes-e10',
    icd10Code: 'E10',
    icd10Description: 'Type 1 diabetes mellitus',
    approvedServiceIds: ['con-001', 'lab-006', 'lab-007', 'lab-005', 'lab-008', 'pha-005'],
    approvedServiceNames: [
      'General Consultation',
      'Fasting Blood Sugar',
      'Random Blood Sugar',
      'HbA1c',
      'Lipid Profile',
      'Metformin'
    ],
    bundleId: 'bundle-diabetes'
  },

  // Hypertension
  {
    id: 'map-hypertension-i10',
    icd10Code: 'I10',
    icd10Description: 'Essential (primary) hypertension',
    approvedServiceIds: ['con-001', 'lab-005', 'lab-008', 'lab-019', 'pha-007', 'pha-006'],
    approvedServiceNames: [
      'General Consultation',
      'HbA1c',
      'Lipid Profile',
      'Electrocardiogram',
      'Lisinopril',
      'Amlodipine'
    ],
    bundleId: 'bundle-hypertension'
  },
  {
    id: 'map-hypertension-i11',
    icd10Code: 'I11',
    icd10Description: 'Hypertensive heart disease',
    approvedServiceIds: ['con-001', 'lab-005', 'lab-008', 'lab-019', 'pha-007', 'pha-006'],
    approvedServiceNames: [
      'General Consultation',
      'HbA1c',
      'Lipid Profile',
      'Electrocardiogram',
      'Lisinopril',
      'Amlodipine'
    ],
    bundleId: 'bundle-hypertension'
  },

  // Gastroenteritis
  {
    id: 'map-gastroenteritis-a09',
    icd10Code: 'A09',
    icd10Description: 'Infectious gastroenteritis and colitis, unspecified',
    approvedServiceIds: ['con-001', 'lab-001', 'lab-003', 'pha-005', 'pha-004'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Urinalysis',
      'Metformin',
      'Ciprofloxacin'
    ],
    bundleId: 'bundle-gastroenteritis'
  },
  {
    id: 'map-gastroenteritis-k52',
    icd10Code: 'K52',
    icd10Description: 'Other noninfective gastroenteritis and colitis',
    approvedServiceIds: ['con-001', 'lab-001', 'lab-003', 'pha-005', 'pha-004'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Urinalysis',
      'Metformin',
      'Ciprofloxacin'
    ],
    bundleId: 'bundle-gastroenteritis'
  },

  // Upper Respiratory Tract Infection
  {
    id: 'map-urti-j06.9',
    icd10Code: 'J06.9',
    icd10Description: 'Acute upper respiratory infection, unspecified',
    approvedServiceIds: ['con-001', 'lab-001', 'pha-003', 'pha-001', 'pha-009'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Amoxicillin',
      'Paracetamol',
      'Salbutamol Inhaler'
    ],
    bundleId: 'bundle-urti'
  },
  {
    id: 'map-urti-j00',
    icd10Code: 'J00',
    icd10Description: 'Acute nasopharyngitis (common cold)',
    approvedServiceIds: ['con-001', 'lab-001', 'pha-003', 'pha-001', 'pha-009'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Amoxicillin',
      'Paracetamol',
      'Salbutamol Inhaler'
    ],
    bundleId: 'bundle-urti'
  },

  // Peptic Ulcer Disease
  {
    id: 'map-pud-k25',
    icd10Code: 'K25',
    icd10Description: 'Gastric ulcer',
    approvedServiceIds: ['con-001', 'lab-001', 'pha-008', 'pha-003'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Omeprazole',
      'Amoxicillin'
    ],
    bundleId: 'bundle-pud'
  },
  {
    id: 'map-pud-k26',
    icd10Code: 'K26',
    icd10Description: 'Duodenal ulcer',
    approvedServiceIds: ['con-001', 'lab-001', 'pha-008', 'pha-003'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Omeprazole',
      'Amoxicillin'
    ],
    bundleId: 'bundle-pud'
  },
  {
    id: 'map-pud-k27',
    icd10Code: 'K27',
    icd10Description: 'Peptic ulcer, site unspecified',
    approvedServiceIds: ['con-001', 'lab-001', 'pha-008', 'pha-003'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Omeprazole',
      'Amoxicillin'
    ],
    bundleId: 'bundle-pud'
  },

  // Anemia
  {
    id: 'map-anemia-d50',
    icd10Code: 'D50',
    icd10Description: 'Iron deficiency anemia',
    approvedServiceIds: ['con-001', 'lab-001', 'lab-014', 'pha-002', 'pha-010', 'pha-009'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Hemoglobin Electrophoresis',
      'Ferrous Sulfate',
      'Folic Acid',
      'Salbutamol Inhaler'
    ],
    bundleId: 'bundle-anemia'
  },
  {
    id: 'map-anemia-d64',
    icd10Code: 'D64',
    icd10Description: 'Other anemias',
    approvedServiceIds: ['con-001', 'lab-001', 'lab-014', 'pha-002', 'pha-010', 'pha-009'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Hemoglobin Electrophoresis',
      'Ferrous Sulfate',
      'Folic Acid',
      'Salbutamol Inhaler'
    ],
    bundleId: 'bundle-anemia'
  },

  // Pregnancy
  {
    id: 'map-pregnancy-z34',
    icd10Code: 'Z34',
    icd10Description: 'Encounter for supervision of normal pregnancy',
    approvedServiceIds: ['con-001', 'lab-001', 'lab-003', 'lab-010', 'lab-011', 'lab-014', 'pha-010', 'pha-002'],
    approvedServiceNames: [
      'General Consultation',
      'Full Blood Count',
      'Urinalysis',
      'Pregnancy Test',
      'Blood Group/Genotype',
      'Hemoglobin Electrophoresis',
      'Folic Acid',
      'Ferrous Sulfate'
    ],
    bundleId: 'bundle-pregnancy'
  }
];

/**
 * Retrieves approved services for a specific ICD-10 diagnosis code
 *
 * @param icd10Code - The ICD-10 diagnosis code (e.g., "B50", "A01", "N39.0")
 * @returns The service mapping for the diagnosis, or undefined if not found
 *
 * @example
 * ```typescript
 * const services = getServicesForDiagnosis('B50');
 * // Returns mapping with malaria protocol services
 * ```
 */
export function getServicesForDiagnosis(icd10Code: string): ICD10ServiceMapping | undefined {
  const normalizedCode = icd10Code.trim().toUpperCase();

  // Exact match first
  const exactMatch = ICD10_SERVICE_MAPPINGS.find(
    mapping => mapping.icd10Code.toUpperCase() === normalizedCode
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Try to match parent code (e.g., "A01" matches "A01.0", "A01.1")
  const parentMatch = ICD10_SERVICE_MAPPINGS.find(
    mapping => normalizedCode.startsWith(mapping.icd10Code.toUpperCase())
  );

  return parentMatch;
}

/**
 * Retrieves approved services for multiple ICD-10 diagnosis codes
 *
 * @param codes - Array of ICD-10 diagnosis codes
 * @returns Array of service mappings for all found diagnoses
 *
 * @example
 * ```typescript
 * const services = getServicesForMultipleDiagnoses(['B50', 'E11', 'I10']);
 * // Returns array with mappings for malaria, diabetes, and hypertension
 * ```
 */
export function getServicesForMultipleDiagnoses(codes: string[]): ICD10ServiceMapping[] {
  const mappings: ICD10ServiceMapping[] = [];
  const seenBundleIds = new Set<string>();

  for (const code of codes) {
    const mapping = getServicesForDiagnosis(code);

    if (mapping) {
      // Avoid duplicate bundle services for same diagnosis category
      if (mapping.bundleId && seenBundleIds.has(mapping.bundleId)) {
        continue;
      }

      mappings.push(mapping);

      if (mapping.bundleId) {
        seenBundleIds.add(mapping.bundleId);
      }
    }
  }

  return mappings;
}

/**
 * Retrieves all available ICD-10 to service mappings
 *
 * @returns Complete array of all service mappings
 *
 * @example
 * ```typescript
 * const allMappings = getAllMappings();
 * // Returns all 30+ ICD-10 service mappings
 * ```
 */
export function getAllMappings(): ICD10ServiceMapping[] {
  return [...ICD10_SERVICE_MAPPINGS];
}

/**
 * Gets unique bundle IDs from the mappings
 *
 * @returns Array of unique bundle IDs
 */
export function getUniqueBundleIds(): string[] {
  const bundleIds = ICD10_SERVICE_MAPPINGS
    .map(mapping => mapping.bundleId)
    .filter((id): id is string => id !== undefined);

  return Array.from(new Set(bundleIds));
}

/**
 * Gets all mappings for a specific bundle
 *
 * @param bundleId - The bundle identifier (e.g., "bundle-malaria")
 * @returns Array of all mappings associated with the bundle
 */
export function getMappingsByBundle(bundleId: string): ICD10ServiceMapping[] {
  return ICD10_SERVICE_MAPPINGS.filter(mapping => mapping.bundleId === bundleId);
}

/**
 * Merges services from multiple mappings, removing duplicates
 *
 * @param mappings - Array of service mappings
 * @returns Object with unique service IDs and names
 */
export function mergeServiceMappings(mappings: ICD10ServiceMapping[]): {
  serviceIds: string[];
  serviceNames: string[];
} {
  const serviceIdSet = new Set<string>();
  const serviceNameSet = new Set<string>();

  for (const mapping of mappings) {
    mapping.approvedServiceIds.forEach(id => serviceIdSet.add(id));
    mapping.approvedServiceNames.forEach(name => serviceNameSet.add(name));
  }

  return {
    serviceIds: Array.from(serviceIdSet),
    serviceNames: Array.from(serviceNameSet)
  };
}
