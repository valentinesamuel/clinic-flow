import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { staffApi } from '@/api/staff';

export function useStaff() {
  return useQuery({
    queryKey: queryKeys.staff.lists(),
    queryFn: () => staffApi.getAll(),
  });
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: queryKeys.staff.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: !!id,
  });
}

export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.staff.list({ role: 'doctor' }),
    queryFn: () => staffApi.getDoctors(),
  });
}

export function useNurses() {
  return useQuery({
    queryKey: queryKeys.staff.list({ role: 'nurse' }),
    queryFn: () => staffApi.getNurses(),
  });
}

export function useRoster() {
  return useQuery({
    queryKey: [...queryKeys.staff.all, 'roster'],
    queryFn: () => staffApi.getRoster(),
  });
}

export function useStaffRoster(staffId: string) {
  return useQuery({
    queryKey: [...queryKeys.staff.all, 'roster', staffId],
    queryFn: () => staffApi.getStaffRoster(staffId),
    enabled: !!staffId,
  });
}
