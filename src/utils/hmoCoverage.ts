import { BillItem, Bill, ClaimItem, HMOItemStatus } from '@/types/billing.types';
import { getCoverageForService } from '@/data/hmo-service-coverage';

interface CoverageResult {
  hmoStatus: HMOItemStatus;
  hmoCoveredAmount: number;
  patientLiabilityAmount: number;
  hmoServiceCoverageId?: string;
}

export function calculateItemCoverage(
  serviceId: string,
  hmoProviderId: string,
  itemTotal: number
): CoverageResult {
  const coverage = getCoverageForService(serviceId, hmoProviderId);

  if (!coverage || !coverage.isActive || coverage.coverageType === 'none') {
    return {
      hmoStatus: 'not_covered',
      hmoCoveredAmount: 0,
      patientLiabilityAmount: itemTotal,
    };
  }

  let hmoCoveredAmount = 0;

  switch (coverage.coverageType) {
    case 'full':
      hmoCoveredAmount = itemTotal;
      break;
    case 'partial_percent':
      hmoCoveredAmount = Math.round(itemTotal * (coverage.coveragePercentage || 0) / 100);
      break;
    case 'partial_flat':
      hmoCoveredAmount = Math.min(coverage.coverageFlatAmount || 0, itemTotal);
      break;
  }

  if (coverage.maxCoveredAmount && hmoCoveredAmount > coverage.maxCoveredAmount) {
    hmoCoveredAmount = coverage.maxCoveredAmount;
  }

  const patientLiabilityAmount = itemTotal - hmoCoveredAmount;
  const hmoStatus: HMOItemStatus = hmoCoveredAmount >= itemTotal ? 'covered' : hmoCoveredAmount > 0 ? 'partial' : 'not_covered';

  return {
    hmoStatus,
    hmoCoveredAmount,
    patientLiabilityAmount,
    hmoServiceCoverageId: coverage.id,
  };
}

export function calculateBillCoverage(
  items: BillItem[],
  hmoProviderId: string
): { items: BillItem[]; hmoTotalCoverage: number; patientTotalLiability: number } {
  let hmoTotalCoverage = 0;
  let patientTotalLiability = 0;

  const updatedItems = items.map((item) => {
    if (item.isOptedOutOfHMO) {
      patientTotalLiability += item.total;
      return {
        ...item,
        hmoStatus: 'opted_out' as HMOItemStatus,
        hmoCoveredAmount: 0,
        patientLiabilityAmount: item.total,
      };
    }

    const serviceId = item.id;
    const result = calculateItemCoverage(serviceId, hmoProviderId, item.total);
    hmoTotalCoverage += result.hmoCoveredAmount;
    patientTotalLiability += result.patientLiabilityAmount;

    return {
      ...item,
      hmoStatus: result.hmoStatus,
      hmoCoveredAmount: result.hmoCoveredAmount,
      patientLiabilityAmount: result.patientLiabilityAmount,
      hmoServiceCoverageId: result.hmoServiceCoverageId,
    };
  });

  return { items: updatedItems, hmoTotalCoverage, patientTotalLiability };
}

export function buildClaimItemsFromBill(
  bill: Bill,
  hmoProviderId: string
): { claimItems: ClaimItem[]; claimAmount: number } {
  const { items } = calculateBillCoverage(bill.items, hmoProviderId);

  const coveredItems = items.filter(
    (item) => !item.isOptedOutOfHMO && item.hmoStatus !== 'not_covered' && (item.hmoCoveredAmount || 0) > 0
  );

  const claimItems: ClaimItem[] = coveredItems.map((item) => ({
    id: item.id,
    description: item.description,
    category: item.category,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    claimedAmount: item.hmoCoveredAmount || 0,
    isExcluded: false,
  }));

  const claimAmount = claimItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  return { claimItems, claimAmount };
}
