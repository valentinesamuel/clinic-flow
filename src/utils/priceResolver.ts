import { PayerType, ResolvedPrice, CoverageStatus } from '@/types/financial.types';
import { ServiceCategory } from '@/types/billing.types';
import { mockServicePrices } from '@/data/service-pricing';
import { LAB_ITEMS, PHARMACY_ITEMS, ServiceItem } from '@/data/bill-items';
import { HMO_PROVIDERS } from '@/data/hmo-providers';

function findServicePrice(itemName: string, category: ServiceCategory) {
  const normalizedName = itemName.toLowerCase();
  return mockServicePrices.find(sp =>
    sp.category === category &&
    sp.isActive &&
    sp.name.toLowerCase().includes(normalizedName.split(' ')[0].toLowerCase())
  );
}

function findBillItem(itemId: string, category: ServiceCategory): ServiceItem | undefined {
  if (category === 'lab') return LAB_ITEMS.find(i => i.id === itemId);
  if (category === 'pharmacy') return PHARMACY_ITEMS.find(i => i.id === itemId);
  return undefined;
}

function findDefaultPrice(itemId: string, category: ServiceCategory): number {
  const item = findBillItem(itemId, category);
  return item?.defaultPrice ?? 0;
}

export function resolvePrice(
  itemId: string,
  itemName: string,
  category: ServiceCategory,
  payerType: PayerType,
  hmoProviderId?: string,
): ResolvedPrice {
  const resolvedCategory = category as ResolvedPrice['category'];
  const servicePrice = findServicePrice(itemName, category);
  const billItem = findBillItem(itemId, category);
  const defaultPrice = findDefaultPrice(itemId, category);
  const standardPrice = servicePrice?.standardPrice ?? defaultPrice;

  // Determine premium/restricted flags from both bill item and service price
  const isPremium = billItem?.isPremium || servicePrice?.isPremium || false;
  const isRestricted = billItem?.isRestricted || servicePrice?.isRestricted || false;
  const restrictionReason = billItem?.restrictionReason || servicePrice?.restrictionReason;

  if (payerType === 'cash' || payerType === 'corporate') {
    return {
      itemId,
      itemName,
      category: resolvedCategory,
      standardPrice,
      payerPrice: standardPrice,
      coverageStatus: 'not_covered',
      patientLiability: standardPrice,
      hmoLiability: 0,
      isPremium,
      isRestricted,
      restrictionReason,
    };
  }

  // HMO payer
  const hmoPrice = servicePrice?.hmoPrice;
  const hmoProvider = hmoProviderId ? HMO_PROVIDERS.find(p => p.id === hmoProviderId) : undefined;
  const copay = hmoProvider?.defaultCopay ?? 0;

  if (hmoPrice == null) {
    // No HMO price — patient pays full standard price
    return {
      itemId,
      itemName,
      category: resolvedCategory,
      standardPrice,
      payerPrice: standardPrice,
      coverageStatus: 'not_covered',
      patientLiability: standardPrice,
      hmoLiability: 0,
      isPremium,
      isRestricted,
      restrictionReason,
    };
  }

  const coverageStatus: CoverageStatus = copay > 0 ? 'partial' : 'covered';
  const patientLiability = Math.min(copay, hmoPrice);
  const hmoLiability = hmoPrice - patientLiability;

  return {
    itemId,
    itemName,
    category: resolvedCategory,
    standardPrice,
    payerPrice: hmoPrice,
    coverageStatus,
    patientLiability,
    hmoLiability,
    isPremium,
    isRestricted,
    restrictionReason,
  };
}
