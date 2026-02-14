import { apiClient } from '../client';

export const locationsApi = {
  getStates: async () => (await apiClient.get('/nigerian-states')).data,
  getLGAsByState: async () => {
    const { data } = await apiClient.get('/lgas');
    // Reconstruct the Record<string, LGAOption[]> shape
    const result: Record<string, any[]> = {};
    for (const lga of data) {
      if (!result[lga.state]) result[lga.state] = [];
      result[lga.state].push({ value: lga.value, label: lga.label });
    }
    return result;
  },
  getLGAsForState: async (stateValue: string) =>
    (await apiClient.get('/lgas', { params: { state: stateValue } })).data.map(
      (lga: any) => ({ value: lga.value, label: lga.label }),
    ),
  findStateByValue: async (value: string) => {
    const { data } = await apiClient.get('/nigerian-states', {
      params: { value },
    });
    return data[0] || null;
  },
};
