import { apiClient } from './client';

export const paymentsApi = {
  getAll: async () => (await apiClient.get('/payments')).data,
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
  ) => {
    const params: Record<string, unknown> = { _page: page, _limit: limit, ...filters };
    const response = await apiClient.get('/payments', { params });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || response.data.length),
      page,
      limit,
    };
  },
  getById: async (id: string) => (await apiClient.get(`/payments/${id}`)).data,
  getByDateRange: async (start: string, end: string) =>
    (await apiClient.get('/payments', {
      params: { date_gte: start, date_lte: end },
    })).data,
  getDailyRevenue: async (_date?: string) => {
    const { data: payments } = await apiClient.get('/payments');
    // Compute client-side (same as original logic)
    const total = payments.reduce(
      (sum: number, p: any) => sum + (p.amount || 0),
      0,
    );
    return {
      total,
      count: payments.length,
      byMethod: {} as Record<string, number>,
    };
  },
  getTodays: async () => {
    const today = new Date().toISOString().split('T')[0];
    return (await apiClient.get('/payments', {
      params: { date_gte: today },
    })).data;
  },
};
