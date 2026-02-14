import { apiClient } from './client';

export const billsApi = {
  getAll: async () => (await apiClient.get('/bills')).data,
  getItems: async () => (await apiClient.get('/service-items')).data,
  getShifts: async () => (await apiClient.get('/cashier-shifts')).data,
  getBillingCodes: async () => (await apiClient.get('/billing-codes')).data,
  getEmergencyOverrides: async () =>
    (await apiClient.get('/emergency-overrides')).data,
  getCurrentShift: async (station: string, cashierId?: string) => {
    const params: Record<string, string> = { station, status: 'active' };
    if (cashierId) params.cashierId = cashierId;
    const { data } = await apiClient.get('/cashier-shifts', { params });
    return data[0] || null;
  },
  getShiftTransactions: async (shiftId: string) => {
    const { data: payments } = await apiClient.get('/payments', {
      params: { shiftId },
    });
    return payments;
  },
  getBillingCodeByCode: async (code: string) => {
    const { data } = await apiClient.get('/billing-codes', { params: { code } });
    return data[0] || null;
  },
  getPendingBillingCodes: async (department?: string) => {
    const params: Record<string, string> = { status: 'pending_approval' };
    if (department) params.department = department;
    const { data } = await apiClient.get('/billing-codes', { params });
    return data;
  },
  getActiveEmergencyOverrides: async () =>
    (await apiClient.get('/emergency-overrides', { params: { isActive: true } })).data,
  getEmergencyOverrideByPatient: async (patientId: string) => {
    const { data } = await apiClient.get('/emergency-overrides', {
      params: { patientId, isActive: true },
    });
    return data[0] || null;
  },
  calculateShiftStats: async (shift: any) => {
    // Pure computation — keep client-side
    const { calculateShiftStats } = await import('@/data/cashier-shifts');
    return calculateShiftStats(shift);
  },
};
