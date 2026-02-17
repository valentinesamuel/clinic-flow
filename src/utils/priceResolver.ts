import { PayerType, ResolvedPrice, CoverageStatus } from '@/types/financial.types';
import { ServiceCategory } from '@/types/billing.types';
import { ServicePrice } from '@/types/cashier.types';
import { ServiceItem } from '@/types/billing.types';
import { HMOProvider } from '@/types/billing.types';

interface PriceResolverData {
  servicePrices: ServicePrice[];
  labItems: ServiceItem[];
  pharmacyItems: ServiceItem[];
  hmoProviders: HMOProvider[];
}

function findServicePrice(itemName: string, category: ServiceCategory, servicePrices: ServicePrice[]) {
  const normalizedName = itemName.toLowerCase();
  return servicePrices.find(sp =>
    sp.category === category &&
    sp.isActive &&
    sp.name.toLowerCase().includes(normalizedName.split(' ')[0].toLowerCase())
  );
}

function findBillItem(itemId: string, category: ServiceCategory, labItems: ServiceItem[], pharmacyItems: ServiceItem[]): ServiceItem | undefined {
  if (category === 'lab') return labItems.find(i => i.id === itemId);
  if (category === 'pharmacy') return pharmacyItems.find(i => i.id === itemId);
  return undefined;
}

function findDefaultPrice(itemId: string, category: ServiceCategory, labItems: ServiceItem[], pharmacyItems: ServiceItem[]): number {
  const item = findBillItem(itemId, category, labItems, pharmacyItems);
  return item?.defaultPrice ?? 0;
}

export function resolvePrice(
  itemId: string,
  itemName: string,
  category: ServiceCategory,
  payerType: PayerType,
  data: PriceResolverData,
  hmoProviderId?: string,
): ResolvedPrice {
  const { servicePrices, labItems, pharmacyItems, hmoProviders } = data;
  const resolvedCategory = category as ResolvedPrice['category'];
  const servicePrice = findServicePrice(itemName, category, servicePrices);
  const billItem = findBillItem(itemId, category, labItems, pharmacyItems);
  const defaultPrice = findDefaultPrice(itemId, category, labItems, pharmacyItems);
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
  const hmoProvider = hmoProviderId ? hmoProviders.find(p => p.id === hmoProviderId) : undefined;
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
