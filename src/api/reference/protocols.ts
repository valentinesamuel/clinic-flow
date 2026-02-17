import { apiClient } from '../client';
import { ConflictRule } from '@/types/consultation.types';

export const protocolsApi = {
  getBundles: async () => (await apiClient.get('/protocol-bundles')).data,
  getBundlesForDiagnosis: async (icd10Code: string) =>
    (await apiClient.get('/protocol-bundles', {
      params: { q: icd10Code },
    })).data,
  getBundleById: async (id: string) =>
    (await apiClient.get(`/protocol-bundles/${id}`)).data,
  getConflictRules: async (): Promise<ConflictRule[]> =>
    (await apiClient.get<ConflictRule[]>('/conflict-rules')).data,
  findConflicts: async (labCodes: string[], drugNames: string[]): Promise<ConflictRule[]> => {
    // Fetch all rules and filter client-side (json-server can't do complex queries)
    const { data: rules } = await apiClient.get<ConflictRule[]>('/conflict-rules');
    return rules.filter((rule: ConflictRule) => {
      const hasLab = labCodes.some((code) =>
        rule.conflictingLabTestCode?.includes(code),
      );
      const hasDrug = drugNames.some((name) =>
        rule.drugNamePattern?.toLowerCase().includes(name.toLowerCase()),
      );
      return hasLab && hasDrug;
    });
  },
};
