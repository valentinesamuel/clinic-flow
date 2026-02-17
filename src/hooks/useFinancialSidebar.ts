import { useMemo } from 'react';
import { PayerType, ResolvedPrice, FinancialSummary } from '@/types/financial.types';
import { ConsultationLabOrder, ConsultationPrescriptionItem } from '@/types/consultation.types';
import { usePriceResolver } from './usePriceResolver';

export function useFinancialSidebar(
  labOrders: ConsultationLabOrder[],
  prescriptionItems: ConsultationPrescriptionItem[],
  payerType: PayerType,
  hmoProviderId?: string,
) {
  const { resolver, isLoading, isError, isReady } = usePriceResolver();

  const resolvedPrices = useMemo(() => {
    if (!isReady || !resolver) {
      return [];
    }

    const labPrices: ResolvedPrice[] = labOrders.map(order =>
      resolver(order.testCode, order.testName, 'lab', payerType, hmoProviderId)
    );

    const pharmPrices: ResolvedPrice[] = prescriptionItems.map(item =>
      resolver(item.drugName, item.drugName, 'pharmacy', payerType, hmoProviderId)
    );

    return [...labPrices, ...pharmPrices];
  }, [labOrders, prescriptionItems, payerType, hmoProviderId, isReady, resolver]);

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

  return {
    resolvedPrices,
    summary,
    priceSnapshotMap,
    isLoading,
    isError,
    isReady,
  };
}
