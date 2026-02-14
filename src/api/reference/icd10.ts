import { apiClient } from '../client';

export const icd10Api = {
  getCodes: async () => (await apiClient.get('/icd10-codes')).data,
  getCategories: async () => {
    const { data } = await apiClient.get('/icd10-categories/1');
    return data.categories;
  },
  search: async (query: string) =>
    (await apiClient.get('/icd10-codes', { params: { q: query } })).data,
  getByCategory: async (category: string) =>
    (await apiClient.get('/icd10-codes', { params: { category } })).data,
  getCommon: async () => {
    const { data } = await apiClient.get('/icd10-codes');
    return data.filter((c: any) => c.isCommon);
  },
  getServiceMappings: async () =>
    (await apiClient.get('/icd10-service-mappings')).data,
  getServicesForDiagnosis: async (code: string) => {
    const { data } = await apiClient.get('/icd10-service-mappings', {
      params: { diagnosisCode: code },
    });
    return data[0] || null;
  },
  getAllMappings: async () =>
    (await apiClient.get('/icd10-service-mappings')).data,
};
