import { apiClient } from '../client';

export const hmoApi = {
  getProviders: async () =>
    (await apiClient.get('/hmo-providers-extended')).data,
  getProviderById: async (id: string) =>
    (await apiClient.get(`/hmo-providers-extended/${id}`)).data,
  getActiveProviders: async () =>
    (await apiClient.get('/hmo-providers-extended', { params: { isActive: true } })).data,
  getRules: async () => (await apiClient.get('/hmo-rules')).data,
  getRulesForProvider: async (providerId: string) =>
    (await apiClient.get('/hmo-rules', { params: { providerId } })).data,
  getServiceCoverages: async () =>
    (await apiClient.get('/hmo-service-coverage')).data,
  getCoverageForService: async (serviceCode: string, providerId: string) => {
    const { data } = await apiClient.get('/hmo-service-coverage', {
      params: { serviceCode, providerId },
    });
    return data[0] || null;
  },
  getCoveragesForProvider: async (providerId: string) =>
    (await apiClient.get('/hmo-service-coverage', { params: { providerId } })).data,
};
