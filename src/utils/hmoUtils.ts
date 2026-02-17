// HMO Clinical Rules Utility Functions

import { HMORule, HMORuleField, ConsultationDiagnosis, ConsultationLabOrder } from '@/types/consultation.types';
import { VitalSigns } from '@/types/clinical.types';

export interface HMOAlertResult {
  rule: HMORule;
  passed: boolean;
  actualValue?: string | number;
}

/**
 * Get HMO rules applicable to a specific provider
 * @param providerId HMO provider ID
 * @param rules Full list of HMO rules
 * @returns Filtered rules for the provider
 */
export function getHMORulesForProvider(providerId: string, rules: HMORule[]): HMORule[] {
  return rules.filter(rule => rule.hmoProviderId === providerId);
}

/**
 * Evaluate HMO clinical rules against patient data
 * @param providerId HMO provider ID
 * @param diagnoses Patient diagnoses
 * @param vitals Patient vital signs
 * @param labOrders Lab orders for the patient
 * @param rules Full list of HMO rules
 * @returns Array of rule evaluation results
 */
export function evaluateHMORules(
  providerId: string,
  diagnoses: ConsultationDiagnosis[],
  vitals: VitalSigns | null | undefined,
  labOrders: ConsultationLabOrder[],
  rules: HMORule[]
): HMOAlertResult[] {
  const providerRules = getHMORulesForProvider(providerId, rules);
  const diagnosisCodes = diagnoses.map(d => d.code);

  return providerRules
    .filter(rule =>
      rule.icdCodesApplicable.some(code =>
        diagnosisCodes.some(dc => dc.startsWith(code)),
      ),
    )
    .map(rule => {
      let passed = false;
      let actualValue: string | number | undefined;

      if (rule.ruleField === 'labOrder') {
        const testCodeToFind = String(rule.value).toUpperCase();
        const found = labOrders.some(o => {
          const tc = o.testCode.toUpperCase();
          const tn = o.testName.toUpperCase();
          return tc.includes(testCodeToFind) || tn.includes(testCodeToFind);
        });
        passed = found;
        actualValue = found ? 'Present' : 'Not ordered';
      } else if (rule.ruleField === 'prescription') {
        // Prescription-based rules can be added later
        passed = true;
      } else {
        // Vital signs based rules
        const vitalValue = vitals ? vitals[rule.ruleField as keyof VitalSigns] : undefined;

        if (vitalValue == null) {
          passed = false;
          actualValue = 'Not recorded';
        } else {
          const numVal = Number(vitalValue);
          actualValue = numVal;
          switch (rule.condition) {
            case 'gte':
              passed = numVal >= Number(rule.value);
              break;
            case 'lte':
              passed = numVal <= Number(rule.value);
              break;
            case 'eq':
              passed = numVal === Number(rule.value);
              break;
            default:
              passed = true;
          }
        }
      }

      return { rule, passed, actualValue };
    });
}
