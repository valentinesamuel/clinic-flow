import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { appointmentsApi } from '@/api/appointments';

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.lists(),
    queryFn: () => appointmentsApi.getAll(),
  });
}
