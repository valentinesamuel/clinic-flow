import {TAPIResponse, TBaseQueryParams, TGetAPIMetaResponse} from "../generic.types";

export type TAppointmentStatus =
    | "scheduled"
    | "confirmed"
    | "checked_in"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";

export enum TAppointmentStatusEnum {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked in",
    IN_PROGRESS = "in progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no show",
}

export type TAppointmentType =
    | "consultation"
    | "follow_up"
    | "emergency"
    | "procedure"
    | "lab_only";

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientMrn: string;
    doctorId: string;
    doctorName: string;
    appointmentType: TAppointmentType;
    status: TAppointmentStatus;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    reasonForVisit: string;
    notes?: string;
    createdAt: string;
    createdBy: string;
}

export type TGetAllAppointemntsSuccessResponse = TGetAPIMetaResponse<
    Appointment[]
>;

export type TGetAppointmentsQueryParams = TBaseQueryParams & {
    "filter[status]"?: string;
    "filter[countryId]"?: string;
    "order[businessName]"?: string;
    "filter[companyType]"?: string;
};

export type TCreateAppointmentRequest = {
    id: string;
    [key: string]: unknown;
};

export type TCreateAppointmentSuccessResponse = TAPIResponse<Appointment>;

export type TUpdateAppointmentStatusRequest = {
    status: TAppointmentStatus;
};

export type TUpdateAppointmentStatusSuccessResponse = TAPIResponse<{
    status: TAppointmentStatus;
}>;

export type TUpdateAppointmentRequest = Partial<TCreateAppointmentRequest>;

export type TUpdateAppointmentSuccessResponse =
    TCreateAppointmentSuccessResponse;
