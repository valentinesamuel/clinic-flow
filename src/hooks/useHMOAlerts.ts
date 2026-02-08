import { useMemo } from 'react';
import { VitalSigns } from '@/types/clinical.types';
import { ConsultationDiagnosis, ConsultationLabOrder } from '@/types/consultation.types';
import { evaluateHMORules, HMOAlertResult } from '@/data/hmo-rules';

export function useHMOAlerts(
  hmoProviderId: string | undefined,
  diagnoses: ConsultationDiagnosis[],
  vitals: VitalSigns | null | undefined,
  labOrders: ConsultationLabOrder[],
) {
  const alerts = useMemo((): HMOAlertResult[] => {
    if (!hmoProviderId) return [];
    return evaluateHMORules(hmoProviderId, diagnoses, vitals, labOrders);
  }, [hmoProviderId, diagnoses, vitals, labOrders]);

  return { alerts };
}
