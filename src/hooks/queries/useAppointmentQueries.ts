import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { appointmentsApi } from '@/api/appointments';

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.lists(),
    queryFn: () => appointmentsApi.getAll(),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => appointmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useTodaysAppointments() {
  return useQuery({
    queryKey: [...queryKeys.appointments.lists(), 'today'],
    queryFn: () => appointmentsApi.getTodaysAppointments(),
  });
}

export function useAppointmentsByDoctor(doctorId: string) {
  return useQuery({
    queryKey: queryKeys.appointments.list({ doctorId }),
    queryFn: () => appointmentsApi.getByDoctor(doctorId),
    enabled: !!doctorId,
  });
}

export function useAppointmentsByPatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.appointments.list({ patientId }),
    queryFn: () => appointmentsApi.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.appointments.list({ date }),
    queryFn: () => appointmentsApi.getByDate(date),
    enabled: !!date,
  });
}
