import { useMemo } from 'react';
import { VitalSigns } from '@/types/clinical.types';
import { ConsultationDiagnosis, ConsultationLabOrder, HMOAlertResult } from '@/types/consultation.types';
import { useHMORules } from '@/hooks/queries/useReferenceQueries';

export function useHMOAlerts(
  hmoProviderId: string | undefined,
  diagnoses: ConsultationDiagnosis[],
  vitals: VitalSigns | null | undefined,
  labOrders: ConsultationLabOrder[],
) {
  const { data: hmoRules = [] } = useHMORules();

  const alerts = useMemo((): HMOAlertResult[] => {
    if (!hmoProviderId) return [];
    // Evaluate rules from hook data
    return (hmoRules as any[]).map((rule: any) => {
      let passed = true;
      let actualValue: unknown;

      if (rule.type === 'diagnosis_required' && diagnoses.length === 0) {
        passed = false;
      } else if (rule.type === 'vitals_required' && !vitals) {
        passed = false;
      } else if (rule.type === 'lab_required' && labOrders.length === 0) {
        passed = false;
      }

      return { rule, passed, actualValue };
    });
  }, [hmoProviderId, diagnoses, vitals, labOrders, hmoRules]);

  return { alerts };
}
