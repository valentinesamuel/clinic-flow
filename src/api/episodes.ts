import { apiClient } from './client';

export const episodesApi = {
  getAll: async () => (await apiClient.get('/episodes')).data,
  getTimeline: async (episodeId?: string) => {
    const params = episodeId ? { episodeId } : {};
    return (await apiClient.get('/episode-timeline', { params })).data;
  },
};
