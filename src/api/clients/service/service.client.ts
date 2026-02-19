import Client from "@/api/axios";
import ENDPOINTS from "../endpoints";
import { TCreateServiceRequest, TCreateServiceSuccessResponse, TGetAllServiceQueryParams, TGetAllServiceSuccessResponse, TGetServiceSuccessResponse, TUpdateServiceStatusRequest, TUpdateServiceStatusSuccessResponse } from "./serviceClient.types";

export const serviceClient = {
  getAll: async (queryParams: TGetAllServiceQueryParams) =>
    await Client.get<TGetAllServiceSuccessResponse>(
      ENDPOINTS.APPOINTMENTS.BASE,
      {
        params: queryParams,
      },
    ),

  getById: async (id: string) =>
    await Client.get<TGetServiceSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}`,
      {
        params: id,
      },
    ),

  create: async (appointment: TCreateServiceSuccessResponse) =>
    await Client.post<TCreateServiceSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}`,
      {
        data: appointment,
      },
    ),

  update: async (
    appointmentId: string,
    appointment: Partial<TCreateServiceRequest>,
  ) =>
    await Client.patch<TUpdateServiceStatusSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`,
      appointment,
    ),

  updateStatus: async (
    serviceId: string,
    status: TUpdateServiceStatusRequest,
  ) =>
    await Client.patch<TUpdateServiceStatusSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}/${serviceId}/status`,
      status,
    ),
};
