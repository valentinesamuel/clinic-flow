import { useMemo } from 'react';
import { PayerType, ResolvedPrice, FinancialSummary } from '@/types/financial.types';
import { ConsultationLabOrder, ConsultationPrescriptionItem } from '@/types/consultation.types';
import { resolvePrice } from '@/utils/priceResolver';

export function useFinancialSidebar(
  labOrders: ConsultationLabOrder[],
  prescriptionItems: ConsultationPrescriptionItem[],
  payerType: PayerType,
  hmoProviderId?: string,
) {
  const resolvedPrices = useMemo(() => {
    const labPrices: ResolvedPrice[] = labOrders.map(order =>
      resolvePrice(order.testCode, order.testName, 'lab', payerType, hmoProviderId)
    );

    const pharmPrices: ResolvedPrice[] = prescriptionItems.map(item =>
      resolvePrice(item.drugName, item.drugName, 'pharmacy', payerType, hmoProviderId)
    );

    return [...labPrices, ...pharmPrices];
  }, [labOrders, prescriptionItems, payerType, hmoProviderId]);

  const summary = useMemo((): FinancialSummary => {
    let labTotal = 0;
    let pharmacyTotal = 0;
    let consultationTotal = 0;
    let patientTotal = 0;
    let hmoTotal = 0;

    for (const price of resolvedPrices) {
      const amount = price.payerPrice;
      if (price.category === 'lab') labTotal += amount;
      else if (price.category === 'pharmacy') pharmacyTotal += amount;
      else if (price.category === 'consultation') consultationTotal += amount;

      patientTotal += price.patientLiability;
      hmoTotal += price.hmoLiability;
    }

    return {
      labTotal,
      pharmacyTotal,
      consultationTotal,
      grandTotal: labTotal + pharmacyTotal + consultationTotal,
      patientTotal,
      hmoTotal,
      itemCount: resolvedPrices.length,
    };
  }, [resolvedPrices]);

  // Price snapshot map for metadata wiring at finalize time
  const priceSnapshotMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const price of resolvedPrices) {
      map.set(price.itemId, price.payerPrice);
    }
    return map;
  }, [resolvedPrices]);

  return { resolvedPrices, summary, priceSnapshotMap };
}
