import Client from "@/api/axios";
import ENDPOINTS from "../endpoints";
import {
  TCreateAppointmentRequest,
  TCreateAppointmentSuccessResponse,
  TGetAllAppointmentsSuccessResponse,
  TGetAppointmentsQueryParams,
  TUpdateAppointmentStatusRequest,
  TUpdateAppointmentStatusSuccessResponse,
} from "./appointmentClient.types";

export const appointmentClient = {
  getAll: async (queryParams: TGetAppointmentsQueryParams) =>
    await Client.get<TGetAllAppointmentsSuccessResponse>(
      ENDPOINTS.APPOINTMENTS.BASE,
      {
        params: queryParams,
      },
    ),

  getById: async (id: string) =>
    await Client.get<TGetAllAppointmentsSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}`,
      {
        params: id,
      },
    ),

  create: async (appointment: TCreateAppointmentRequest) =>
    await Client.post<TCreateAppointmentSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}`,
      {
        data: appointment,
      },
    ),

  update: async (
    appointmentId: string,
    appointment: Partial<TCreateAppointmentRequest>,
  ) =>
    await Client.patch<TCreateAppointmentSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`,
      appointment,
    ),

  updateStatus: async (
    appointmentId: string,
    status: TUpdateAppointmentStatusRequest,
  ) =>
    await Client.patch<TUpdateAppointmentStatusSuccessResponse>(
      `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}/status`,
      status,
    ),
};
