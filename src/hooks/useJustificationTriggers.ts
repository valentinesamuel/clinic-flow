import { useMemo } from 'react';
import { ResolvedPrice } from '@/types/financial.types';
import { ConsultationLabOrder, ConsultationPrescriptionItem, JustificationEntry, JustificationTrigger } from '@/types/consultation.types';
import { findConflicts, PatientLabResult } from '@/data/conflict-rules';

export interface JustificationTriggerInfo {
  triggerId: string;
  triggerType: JustificationTrigger;
  triggerDescription: string;
  itemId: string;
  itemName: string;
}

export function useJustificationTriggers(
  labOrders: ConsultationLabOrder[],
  prescriptionItems: ConsultationPrescriptionItem[],
  resolvedPrices: ResolvedPrice[],
  patientLabResults: PatientLabResult[],
  justifications: JustificationEntry[],
) {
  const triggers = useMemo(() => {
    const result: JustificationTriggerInfo[] = [];

    // High-value triggers: premium or restricted items
    for (const price of resolvedPrices) {
      if (price.isPremium || price.isRestricted) {
        const triggerType: JustificationTrigger = 'high_value';
        const description = price.isRestricted
          ? `Restricted item: ${price.itemName}. Justification required.`
          : `Premium item: ${price.itemName}. Justification required.`;

        result.push({
          triggerId: `hv-${price.itemId}`,
          triggerType,
          triggerDescription: description,
          itemId: price.itemId,
          itemName: price.itemName,
        });
      }
    }

    // Conflict triggers: drug-lab conflicts
    for (const rxItem of prescriptionItems) {
      const conflicts = findConflicts(rxItem.drugName, patientLabResults);
      for (const conflict of conflicts) {
        result.push({
          triggerId: `cf-${rxItem.id}-${conflict.id}`,
          triggerType: 'conflict',
          triggerDescription: conflict.description,
          itemId: rxItem.id,
          itemName: rxItem.drugName,
        });
      }
    }

    return result;
  }, [labOrders, prescriptionItems, resolvedPrices, patientLabResults]);

  const unresolvedCount = useMemo(() => {
    return triggers.filter(
      t => !justifications.some(j => j.triggerId === t.triggerId && j.justificationText.length >= 30)
    ).length;
  }, [triggers, justifications]);

  const allResolved = unresolvedCount === 0;

  return { triggers, unresolvedCount, allResolved };
}
