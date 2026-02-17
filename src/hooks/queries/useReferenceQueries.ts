import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { icd10Api } from '@/api/reference/icd10';
import { locationsApi } from '@/api/reference/locations';
import { banksApi } from '@/api/reference/banks';
import { hmoApi } from '@/api/reference/hmo';
import { protocolsApi } from '@/api/reference/protocols';

export function useICD10Search(query: string) {
  return useQuery({
    queryKey: [...queryKeys.reference.icd10(), 'search', query],
    queryFn: () => icd10Api.search(query),
    enabled: query.length >= 2,
  });
}

export function useICD10Categories() {
  return useQuery({
    queryKey: [...queryKeys.reference.icd10(), 'categories'],
    queryFn: () => icd10Api.getCategories(),
  });
}

export function useCommonICD10() {
  return useQuery({
    queryKey: [...queryKeys.reference.icd10(), 'common'],
    queryFn: () => icd10Api.getCommon(),
  });
}

export function useICD10ServiceMappings() {
  return useQuery({
    queryKey: [...queryKeys.reference.icd10(), 'mappings'],
    queryFn: () => icd10Api.getServiceMappings(),
  });
}

export function useServicesForDiagnosis(code: string) {
  return useQuery({
    queryKey: [...queryKeys.reference.icd10(), 'services', code],
    queryFn: () => icd10Api.getServicesForDiagnosis(code),
    enabled: !!code,
  });
}

export function useNigerianStates() {
  return useQuery({
    queryKey: queryKeys.reference.locations(),
    queryFn: () => locationsApi.getStates(),
  });
}

export function useLGAsForState(stateValue: string) {
  return useQuery({
    queryKey: [...queryKeys.reference.locations(), 'lgas', stateValue],
    queryFn: () => locationsApi.getLGAsForState(stateValue),
    enabled: !!stateValue,
  });
}

export function useNigerianBanks() {
  return useQuery({
    queryKey: queryKeys.reference.banks(),
    queryFn: () => banksApi.getAll(),
  });
}

export function useHMOProviders() {
  return useQuery({
    queryKey: [...queryKeys.reference.hmo(), 'providers'],
    queryFn: () => hmoApi.getProviders(),
  });
}

export function useHMOProviderById(id: string) {
  return useQuery({
    queryKey: [...queryKeys.reference.hmo(), 'provider', id],
    queryFn: () => hmoApi.getProviderById(id),
    enabled: !!id,
  });
}

export function useHMORules() {
  return useQuery({
    queryKey: [...queryKeys.reference.hmo(), 'rules'],
    queryFn: () => hmoApi.getRules(),
  });
}

export function useHMOServiceCoverages() {
  return useQuery({
    queryKey: [...queryKeys.reference.hmo(), 'coverages'],
    queryFn: () => hmoApi.getServiceCoverages(),
  });
}

export function useProtocolBundles() {
  return useQuery({
    queryKey: queryKeys.reference.protocols(),
    queryFn: () => protocolsApi.getBundles(),
  });
}

export function useBundlesForDiagnosis(code: string) {
  return useQuery({
    queryKey: [...queryKeys.reference.protocols(), 'diagnosis', code],
    queryFn: () => protocolsApi.getBundlesForDiagnosis(code),
    enabled: !!code,
  });
}

export function useConflictRules() {
  return useQuery({
    queryKey: [...queryKeys.reference.protocols(), 'conflicts'],
    queryFn: () => protocolsApi.getConflictRules(),
  });
}
