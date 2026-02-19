import { TAPIResponse, TBaseQueryParams, TGetAPIMetaResponse } from "../generic.types";


export enum ServiceStatusEnum {
    ACTIVE = "active",
    IN_ACTIVE = "in active",
}


export type TServiceCategory = {
    id: string,
    name: string
}

export type TService = {
    id: string;
    name: string,
    categoryid: string,
    defaultPrice: number,
    status: ServiceStatusEnum,
    category: TServiceCategory
}

export type TGetAllServiceSuccessResponse = TGetAPIMetaResponse<
    TService[]
>;

export type TGetAllServiceQueryParams = TBaseQueryParams & {
    "filter[status]"?: string;
};

export type TGetServiceSuccessResponse = TAPIResponse<TService>

export type TCreateServiceRequest = {
    name: string
    [key: string]: unknown;
};

export type TCreateServiceSuccessResponse = TAPIResponse<TService>;

export type TUpdateServiceStatusRequest = {
    status: ServiceStatusEnum;
};

export type TUpdateServiceStatusSuccessResponse = TAPIResponse<{
    status: ServiceStatusEnum;
}>;

export type TUpdateServiceRequest = Partial<TCreateServiceSuccessResponse>;

export type TUpdateServiceSuccessResponse =
    TCreateServiceSuccessResponse;
