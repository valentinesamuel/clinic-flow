import { apiClient } from './client';

export const servicePricingApi = {
  getAll: async (filters?: Record<string, string>) =>
    (await apiClient.get('/service-prices', { params: filters })).data,
  getPendingApprovals: async () =>
    (await apiClient.get('/price-approvals', { params: { status: 'pending' } })).data,
  getApprovalById: async (id: string) =>
    (await apiClient.get(`/price-approvals/${id}`)).data,
  getById: async (id: string) =>
    (await apiClient.get(`/service-prices/${id}`)).data,
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
  ) => {
    const params: Record<string, unknown> = { _page: page, _limit: limit, ...filters };
    const response = await apiClient.get('/service-prices', { params });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || response.data.length),
      page,
      limit,
    };
  },
  getAllApprovals: async () =>
    (await apiClient.get('/price-approvals')).data,
  updateApprovalStatus: async (
    id: string,
    status: string,
    reviewedBy?: string,
  ) =>
    (await apiClient.patch(`/price-approvals/${id}`, {
      status,
      ...(reviewedBy ? { reviewedBy } : {}),
      reviewedAt: new Date().toISOString(),
    })).data,
};
