// HMO Clinical Requirement Rules

import { HMORule, HMORuleField } from '@/types/consultation.types';
import { VitalSigns } from '@/types/clinical.types';
import { ConsultationDiagnosis, ConsultationLabOrder } from '@/types/consultation.types';

export const HMO_CLINICAL_RULES: HMORule[] = [
  // NHIA rules
  {
    id: 'hmo-rule-001',
    hmoProviderId: 'nhia-001',
    hmoProviderName: 'NHIA Basic Plan',
    ruleField: 'temperature',
    condition: 'gte',
    value: 38,
    icdCodesApplicable: ['B50', 'B51', 'B52', 'B53', 'B54'],
    message: 'NHIA requires documented temperature ≥ 38°C for malaria claims.',
    severity: 'error',
  },
  {
    id: 'hmo-rule-002',
    hmoProviderId: 'nhia-001',
    hmoProviderName: 'NHIA Basic Plan',
    ruleField: 'labOrder',
    condition: 'present',
    value: 'MP',
    icdCodesApplicable: ['B50', 'B51', 'B52', 'B53', 'B54'],
    message: 'NHIA requires Malaria Parasite (MP) test for malaria treatment claims.',
    severity: 'error',
  },
  // Hygeia rules
  {
    id: 'hmo-rule-003',
    hmoProviderId: 'hyg-001',
    hmoProviderName: 'Hygeia HMO',
    ruleField: 'labOrder',
    condition: 'present',
    value: 'MP',
    icdCodesApplicable: ['B50', 'B51', 'B52', 'B53', 'B54'],
    message: 'Hygeia requires MP test to be present for malaria treatment authorization.',
    severity: 'error',
  },
  // AXA rules
  {
    id: 'hmo-rule-004',
    hmoProviderId: 'axa-001',
    hmoProviderName: 'AXA Mansard Health',
    ruleField: 'bloodPressureSystolic',
    condition: 'gte',
    value: 140,
    icdCodesApplicable: ['I10', 'I11', 'I12', 'I13', 'I15'],
    message: 'AXA requires documented BP ≥ 140 systolic for hypertension claims.',
    severity: 'warning',
  },
  // Reliance rules
  {
    id: 'hmo-rule-005',
    hmoProviderId: 'rel-001',
    hmoProviderName: 'Reliance HMO',
    ruleField: 'labOrder',
    condition: 'present',
    value: 'FBC',
    icdCodesApplicable: ['J06.9', 'J00', 'J01', 'J02', 'J03', 'A01', 'N39.0'],
    message: 'Reliance requires lab test (FBC) for antibiotic prescription claims.',
    severity: 'warning',
  },
  // AIICO rules
  {
    id: 'hmo-rule-006',
    hmoProviderId: 'aii-001',
    hmoProviderName: 'AIICO Multishield',
    ruleField: 'labOrder',
    condition: 'present',
    value: 'FBS',
    icdCodesApplicable: ['E10', 'E11', 'E12', 'E13', 'E14'],
    message: 'AIICO requires Fasting Blood Sugar (FBS) test for diabetes medication claims.',
    severity: 'error',
  },
];

export function getHMORulesForProvider(providerId: string): HMORule[] {
  return HMO_CLINICAL_RULES.filter(rule => rule.hmoProviderId === providerId);
}

export interface HMOAlertResult {
  rule: HMORule;
  passed: boolean;
  actualValue?: string | number;
}

export function evaluateHMORules(
  providerId: string,
  diagnoses: ConsultationDiagnosis[],
  vitals: VitalSigns | null | undefined,
  labOrders: ConsultationLabOrder[],
): HMOAlertResult[] {
  const rules = getHMORulesForProvider(providerId);
  const diagnosisCodes = diagnoses.map(d => d.code);

  return rules
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
