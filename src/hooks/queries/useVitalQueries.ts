import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { vitalsApi } from '@/api/vitals';

export function useVitals() {
  return useQuery({
    queryKey: queryKeys.vitals.lists(),
    queryFn: () => vitalsApi.getAll(),
  });
}
