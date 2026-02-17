import { useState, useMemo, useCallback } from 'react';
import { ProtocolBundle } from '@/types/financial.types';
import { ConsultationDiagnosis, ConsultationLabOrder, ConsultationPrescriptionItem, BundleDeselectionRecord } from '@/types/consultation.types';
import { useBundlesForDiagnosis } from '@/hooks/queries/useReferenceQueries';

export function useBundleSuggestion(
  selectedDiagnoses: ConsultationDiagnosis[],
  currentLabOrders: ConsultationLabOrder[],
  currentPrescriptions: ConsultationPrescriptionItem[],
) {
  const primaryCode = selectedDiagnoses.length > 0 ? selectedDiagnoses[0].code : '';
  const { data: bundlesForDiagnosis = [] } = useBundlesForDiagnosis(primaryCode);
  const [dismissedBundles, setDismissedBundles] = useState<Set<string>>(new Set());
  const [appliedBundles, setAppliedBundles] = useState<string[]>([]);
  const [deselectionLog, setDeselectionLog] = useState<BundleDeselectionRecord[]>([]);

  const suggestedBundles = useMemo(() => {
    const allBundles: ProtocolBundle[] = [];
    const seenIds = new Set<string>();

    for (const diagnosis of selectedDiagnoses) {
      // Use data from hook for primary diagnosis, empty for others
      const matches: ProtocolBundle[] = diagnosis.code === primaryCode ? (bundlesForDiagnosis as ProtocolBundle[]) : [];
      for (const bundle of matches) {
        if (!seenIds.has(bundle.id)) {
          seenIds.add(bundle.id);
          allBundles.push(bundle);
        }
      }
    }

    // Filter out dismissed and already-applied bundles
    // Also filter out bundles whose items are already fully present
    return allBundles.filter(bundle => {
      if (dismissedBundles.has(bundle.id)) return false;
      if (appliedBundles.includes(bundle.id)) return false;

      const allLabsPresent = bundle.labTests.every(bt =>
        currentLabOrders.some(o => o.testCode === bt.testCode)
      );
      const allMedsPresent = bundle.medications.every(bm =>
        currentPrescriptions.some(p => p.drugName === bm.drugName)
      );

      return !(allLabsPresent && allMedsPresent);
    });
  }, [selectedDiagnoses, currentLabOrders, currentPrescriptions, dismissedBundles, appliedBundles]);

  const dismissBundle = useCallback((bundleId: string) => {
    setDismissedBundles(prev => new Set([...prev, bundleId]));
  }, []);

  const markApplied = useCallback((
    bundleId: string,
    deselection?: BundleDeselectionRecord,
  ) => {
    setAppliedBundles(prev => [...prev, bundleId]);
    if (deselection && (deselection.deselectedLabTestCodes.length > 0 || deselection.deselectedDrugNames.length > 0)) {
      setDeselectionLog(prev => [...prev, deselection]);
    }
  }, []);

  return { suggestedBundles, appliedBundles, dismissBundle, markApplied, deselectionLog };
}
