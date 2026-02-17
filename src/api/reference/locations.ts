import { apiClient } from '../client';

export interface LGAOption {
  value: string;
  label: string;
}

export const locationsApi = {
  getStates: async () => (await apiClient.get('/nigerian-states')).data,
  getLGAsByState: async (): Promise<Record<string, LGAOption[]>> => {
    const { data } = await apiClient.get('/lgas');
    // Reconstruct the Record<string, LGAOption[]> shape
    const result: Record<string, LGAOption[]> = {};
    for (const lga of data) {
      if (!result[lga.state]) result[lga.state] = [];
      result[lga.state].push({ value: lga.value, label: lga.label });
    }
    return result;
  },
  getLGAsForState: async (stateValue: string): Promise<LGAOption[]> =>
    (await apiClient.get('/lgas', { params: { state: stateValue } })).data.map(
      (lga: { value: string; label: string }) => ({ value: lga.value, label: lga.label }),
    ),
  findStateByValue: async (value: string) => {
    const { data } = await apiClient.get('/nigerian-states', {
      params: { value },
    });
    return data[0] || null;
  },
};
