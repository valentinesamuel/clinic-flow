import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { episodesApi } from '@/api/episodes';

export function useEpisodes() {
  return useQuery({
    queryKey: queryKeys.episodes.lists(),
    queryFn: () => episodesApi.getAll(),
  });
}

export function useEpisodeTimeline(episodeId: string) {
  return useQuery({
    queryKey: [...queryKeys.episodes.detail(episodeId), 'timeline'],
    queryFn: () => episodesApi.getTimeline(episodeId),
    enabled: !!episodeId,
  });
}
