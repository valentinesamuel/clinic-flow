// Drug-Lab Conflict Rules

export interface ConflictRule {
  id: string;
  drugNamePattern: string;
  conflictingLabTestCode: string;
  conflictingLabResult: string;
  description: string;
}

export const CONFLICT_RULES: ConflictRule[] = [
  {
    id: 'conflict-001',
    drugNamePattern: 'artemether',
    conflictingLabTestCode: 'MP',
    conflictingLabResult: 'Negative',
    description: 'Artemether prescribed but Malaria Parasite test is Negative — antimalarial may be unnecessary.',
  },
  {
    id: 'conflict-002',
    drugNamePattern: 'metformin',
    conflictingLabTestCode: 'FBS',
    conflictingLabResult: 'Normal',
    description: 'Metformin prescribed but Fasting Blood Sugar is Normal — antidiabetic may be unnecessary.',
  },
  {
    id: 'conflict-003',
    drugNamePattern: 'amlodipine',
    conflictingLabTestCode: 'BP',
    conflictingLabResult: 'Normal',
    description: 'Antihypertensive prescribed but Blood Pressure is Normal — treatment may be unnecessary.',
  },
  {
    id: 'conflict-004',
    drugNamePattern: 'lisinopril',
    conflictingLabTestCode: 'BP',
    conflictingLabResult: 'Normal',
    description: 'Antihypertensive prescribed but Blood Pressure is Normal — treatment may be unnecessary.',
  },
];

export interface PatientLabResult {
  testCode: string;
  result: string;
  isAbnormal?: boolean;
}

export function findConflicts(
  drugName: string,
  patientLabResults: PatientLabResult[],
): ConflictRule[] {
  const normalizedDrug = drugName.toLowerCase();

  return CONFLICT_RULES.filter(rule => {
    if (!normalizedDrug.includes(rule.drugNamePattern.toLowerCase())) return false;

    const matchingResult = patientLabResults.find(
      lr => lr.testCode.toUpperCase() === rule.conflictingLabTestCode.toUpperCase(),
    );
    if (!matchingResult) return false;

    // Check if the result indicates the conflicting condition
    const resultLower = matchingResult.result.toLowerCase();
    const conflictLower = rule.conflictingLabResult.toLowerCase();

    if (conflictLower === 'negative') {
      return resultLower.includes('negative') || resultLower.includes('not detected');
    }
    if (conflictLower === 'normal') {
      return !matchingResult.isAbnormal;
    }
    return resultLower.includes(conflictLower);
  });
}
