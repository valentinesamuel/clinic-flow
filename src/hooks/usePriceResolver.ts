import { useMemo } from 'react';
import { PayerType, ResolvedPrice } from '@/types/financial.types';
import { ServiceCategory, ServiceItem } from '@/types/billing.types';
import { resolvePrice } from '@/utils/priceResolver';
import { useServicePrices } from './queries/useServicePricingQueries';
import { useServiceItems } from './queries/useBillQueries';
import { useHMOProviders } from './queries/useReferenceQueries';

interface UsePriceResolverOptions {
  enabled?: boolean;
}

export function usePriceResolver(options: UsePriceResolverOptions = {}) {
  const { enabled = true } = options;

  // Fetch all required data
  const { data: servicePrices = [], isLoading: isLoadingPrices, isError: isErrorPrices } = useServicePrices();
  const { data: serviceItems = [], isLoading: isLoadingItems, isError: isErrorItems } = useServiceItems();
  const { data: hmoProviders = [], isLoading: isLoadingProviders, isError: isErrorProviders } = useHMOProviders();

  const isLoading = isLoadingPrices || isLoadingItems || isLoadingProviders;
  const isError = isErrorPrices || isErrorItems || isErrorProviders;

  // Separate items by category
  const { labItems, pharmacyItems } = useMemo(() => {
    const labItems = serviceItems.filter((item: ServiceItem) => item.category === 'lab');
    const pharmacyItems = serviceItems.filter((item: ServiceItem) => item.category === 'pharmacy');
    return { labItems, pharmacyItems };
  }, [serviceItems]);

  // Create resolver function
  const resolver = useMemo(() => {
    if (!enabled || isLoading || isError) {
      return null;
    }

    return (
      itemId: string,
      itemName: string,
      category: ServiceCategory,
      payerType: PayerType,
      hmoProviderId?: string,
    ): ResolvedPrice => {
      return resolvePrice(itemId, itemName, category, payerType, {
        servicePrices,
        labItems,
        pharmacyItems,
        hmoProviders,
      }, hmoProviderId);
    };
  }, [enabled, isLoading, isError, servicePrices, labItems, pharmacyItems, hmoProviders]);

  return {
    resolver,
    isLoading,
    isError,
    isReady: !isLoading && !isError && resolver !== null,
  };
}
