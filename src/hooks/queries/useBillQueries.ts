import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { billsApi } from '@/api/bills';

export function useBills() {
  return useQuery({
    queryKey: queryKeys.bills.lists(),
    queryFn: () => billsApi.getAll(),
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: queryKeys.bills.detail(id),
    queryFn: async () => {
      const bills = await billsApi.getAll();
      const bill = bills.find(b => b.id === id);
      if (!bill) throw new Error(`Bill ${id} not found`);
      return bill;
    },
    enabled: !!id,
  });
}

export function useServiceItems() {
  return useQuery({
    queryKey: [...queryKeys.bills.all, 'items'],
    queryFn: () => billsApi.getItems(),
  });
}

export function useBillingCodes() {
  return useQuery({
    queryKey: [...queryKeys.bills.all, 'codes'],
    queryFn: () => billsApi.getBillingCodes(),
  });
}

export function useCurrentShift(station: string, cashierId?: string) {
  return useQuery({
    queryKey: [...queryKeys.bills.all, 'shift', station, cashierId],
    queryFn: () => billsApi.getCurrentShift(station, cashierId),
  });
}

export function useShiftTransactions(shiftId: string) {
  return useQuery({
    queryKey: [...queryKeys.bills.all, 'shift-transactions', shiftId],
    queryFn: () => billsApi.getShiftTransactions(shiftId),
    enabled: !!shiftId,
  });
}
