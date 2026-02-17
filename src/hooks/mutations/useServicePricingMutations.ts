import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { servicePricingApi } from '@/api/service-pricing';

export function useUpdatePriceApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reviewedBy,
    }: {
      id: string;
      status: string;
      reviewedBy?: string;
    }) => servicePricingApi.updateApprovalStatus(id, status, reviewedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servicePricing.all });
    },
  });
}
