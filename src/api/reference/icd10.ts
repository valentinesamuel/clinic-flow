import { apiClient } from '../client';
import { ICD10Code } from '@/types/clinical.types';

export const icd10Api = {
  getCodes: async (): Promise<ICD10Code[]> => (await apiClient.get<ICD10Code[]>('/icd10-codes')).data,
  getCategories: async () => {
    const { data } = await apiClient.get('/icd10-categories/1');
    return data.categories;
  },
  search: async (query: string): Promise<ICD10Code[]> =>
    (await apiClient.get<ICD10Code[]>('/icd10-codes', { params: { q: query } })).data,
  getByCategory: async (category: string): Promise<ICD10Code[]> =>
    (await apiClient.get<ICD10Code[]>('/icd10-codes', { params: { category } })).data,
  getCommon: async (): Promise<ICD10Code[]> => {
    const { data } = await apiClient.get<ICD10Code[]>('/icd10-codes');
    return data.filter((c: ICD10Code) => c.isCommon);
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
