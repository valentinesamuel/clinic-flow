// Drug-Lab Conflict Detection Utility Functions

export interface ConflictRule {
  id: string;
  drugNamePattern: string;
  conflictingLabTestCode: string;
  conflictingLabResult: string;
  description: string;
}

export interface PatientLabResult {
  testCode: string;
  result: string;
  isAbnormal?: boolean;
}

/**
 * Find conflicts between prescribed drugs and patient lab results
 * @param drugName Name of the prescribed drug
 * @param patientLabResults Patient's lab test results
 * @param conflictRules List of conflict rules to check against
 * @returns Array of applicable conflict rules
 */
export function findConflicts(
  drugName: string,
  patientLabResults: PatientLabResult[],
  conflictRules: ConflictRule[]
): ConflictRule[] {
  const normalizedDrug = drugName.toLowerCase();

  return conflictRules.filter(rule => {
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
