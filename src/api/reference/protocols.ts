import { apiClient } from '../client';

export const protocolsApi = {
  getBundles: async () => (await apiClient.get('/protocol-bundles')).data,
  getBundlesForDiagnosis: async (icd10Code: string) =>
    (await apiClient.get('/protocol-bundles', {
      params: { q: icd10Code },
    })).data,
  getBundleById: async (id: string) =>
    (await apiClient.get(`/protocol-bundles/${id}`)).data,
  getConflictRules: async () =>
    (await apiClient.get('/conflict-rules')).data,
  findConflicts: async (labCodes: string[], drugNames: string[]) => {
    // Fetch all rules and filter client-side (json-server can't do complex queries)
    const { data: rules } = await apiClient.get('/conflict-rules');
    return rules.filter((rule: any) => {
      const hasLab = labCodes.some((code) =>
        rule.labTestCodes?.includes(code),
      );
      const hasDrug = drugNames.some((name) =>
        rule.drugNames?.some((d: string) =>
          d.toLowerCase().includes(name.toLowerCase()),
        ),
      );
      return hasLab && hasDrug;
    });
  },
};
