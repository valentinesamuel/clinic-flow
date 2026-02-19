import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/hooks/queries/queryKeys.ts";
import {TGetBillsQueryParams} from "@/api/clients/bills/bills.types.ts";
import {billsClient} from "@/api/clients/bills/bills.client.ts";

export function useGetBills(queryParams: TGetBillsQueryParams) {
    return useQuery({
        queryKey: queryKeys.bills.lists(),
        queryFn: () => billsClient.getAll(queryParams),
    });
}

export function useGetBillById(id: string) {
    return useQuery({
        queryKey: queryKeys.bills.detail(id),
        queryFn: () => billsClient.getBillById(id),
        enabled: !!id,
    });
}

export function useGetBillByCode(code: string) {
    return useQuery({
        queryKey: queryKeys.bills.detail(code),
        queryFn: () => billsClient.getBillById(code),
        enabled: !!code,
    });
}