import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/hooks/queries/queryKeys";
import {
    TAppointmentStatusEnum,
    TCreateAppointmentRequest,
    TGetAppointmentsQueryParams,
    TUpdateAppointmentRequest,
    TUpdateAppointmentSuccessResponse,
} from "../clients/appointment/appointmentClient.types";
import {offlineApiClient} from "@/lib/offlineApiClient";
import ENDPOINTS from "../clients/endpoints";
import {appointmentClient} from "../clients/appointment/appointment.client";

export function useGetAppointments(queryParams: TGetAppointmentsQueryParams) {
    return useQuery({
        queryKey: queryKeys.appointments.lists(),
        queryFn: () => appointmentClient.getAll(queryParams),
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TCreateAppointmentRequest) =>
            offlineApiClient.post(ENDPOINTS.APPOINTMENTS.BASE, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.appointments.all});
        },
    });
}

export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         appointmentId,
                         data,
                     }: {
            appointmentId: string;
            data: TUpdateAppointmentRequest;
        }) =>
            offlineApiClient.patch<TUpdateAppointmentSuccessResponse>(
                `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`,
                data,
            ),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.appointments.all});
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         appointmentId,
                         reason,
                     }: {
            appointmentId: string;
            reason: string;
        }) =>
            offlineApiClient.patch(
                `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`,
                {
                    status: TAppointmentStatusEnum.CANCELLED,
                    notes: reason,
                },
            ),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.appointments.all});
        },
    });
}

export function useCheckInAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (appointmentId: string) =>
            offlineApiClient.patch(
                `${ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`,
                {
                    status: TAppointmentStatusEnum.CHECKED_IN,
                },
            ),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.appointments.all});
        },
    });
}
