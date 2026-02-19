import Client from "../../axios";
import ENDPOINTS from "../endpoints";
import {
    TGetAllBillsSuccessResponse,
    TGetBillsQueryParams, TGetBillSuccessResponse
} from "@/api/clients/bills/bills.types.ts";


export const billsClient = {
    getAll: async (queryParams: TGetBillsQueryParams) =>
        await Client.get<TGetAllBillsSuccessResponse>(
            ENDPOINTS.BILLS.BASE,
            {
                params: queryParams,
            },
        ),

    getBillByCode: async (code: string) =>
        await Client.get<TGetBillSuccessResponse>(
            `${ENDPOINTS.BILLS.BASE}/${code}/code`,
        ),

    getBillById: async (id: string) =>
        await Client.get<TGetBillSuccessResponse>(
            `${ENDPOINTS.BILLS.BASE}/${id}`,
        ),

};
