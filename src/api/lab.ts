import { apiClient } from './client';

export const labApi = {
  getOrders: async () => (await apiClient.get('/lab-orders')).data,
  getTestCatalog: async () => (await apiClient.get('/test-catalog')).data,
  getPending: async () => {
    const { data } = await apiClient.get('/lab-orders');
    return data.filter((o: any) =>
      ['ordered', 'sample_collected', 'processing'].includes(o.status),
    );
  },
  getByStatus: async (status: string) =>
    (await apiClient.get('/lab-orders', { params: { status } })).data,
  getUrgent: async () => {
    const { data } = await apiClient.get('/lab-orders', {
      params: { priority: 'stat' },
    });
    return data.filter((o: any) => o.status !== 'completed');
  },
  getByPatient: async (patientId: string) =>
    (await apiClient.get('/lab-orders', { params: { patientId } })).data,
  getForReview: async () => {
    const { data } = await apiClient.get('/lab-orders', {
      params: { status: 'completed' },
    });
    return data.filter((o: any) => o.tests?.some((t: any) => t.isAbnormal));
  },
  getOrderById: async (id: string) =>
    (await apiClient.get(`/lab-orders/${id}`)).data,
  updateStatus: async (id: string, status: string) =>
    (await apiClient.patch(`/lab-orders/${id}`, {
      status,
      ...(status === 'sample_collected'
        ? { collectedAt: new Date().toISOString() }
        : {}),
      ...(status === 'completed'
        ? { completedAt: new Date().toISOString() }
        : {}),
    })).data,
  updateOrder: async (id: string, updates: Record<string, unknown>) =>
    (await apiClient.patch(`/lab-orders/${id}`, updates)).data,
  createOrder: async (data: Record<string, unknown>) =>
    (await apiClient.post('/lab-orders', {
      ...data,
      orderedAt: new Date().toISOString(),
    })).data,
  getForOutbound: async () => {
    const { data } = await apiClient.get('/lab-orders');
    return data.filter(
      (o: any) =>
        ['ordered', 'sample_collected'].includes(o.status) && !o.referralId,
    );
  },
  // Referrals
  getPartnerLabs: async () => (await apiClient.get('/partner-labs')).data,
  getConnectedPartnerLabs: async () => {
    const { data } = await apiClient.get('/partner-labs', {
      params: { status: 'connected' },
    });
    return data;
  },
  getReferralsByDirection: async (direction: string) =>
    (await apiClient.get('/lab-referrals', { params: { direction } })).data,
  getReferralById: async (id: string) =>
    (await apiClient.get(`/lab-referrals/${id}`)).data,
  createReferral: async (data: Record<string, unknown>) =>
    (await apiClient.post('/lab-referrals', {
      ...data,
      referredAt: new Date().toISOString(),
    })).data,
  updateReferralStatus: async (id: string, status: string) =>
    (await apiClient.patch(`/lab-referrals/${id}`, { status })).data,
};
