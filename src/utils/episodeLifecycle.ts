import { Episode } from '@/types/episode.types';

export function shouldAutoComplete(episode: Episode): boolean {
  if (episode.status === 'completed' || episode.status === 'auto_completed') {
    return false;
  }
  const now = new Date();
  const expiresAt = new Date(episode.expiresAt);
  return now > expiresAt;
}

export function lockEpisodeForAudit(episode: Episode): Episode {
  return {
    ...episode,
    isLockedForAudit: true,
    status: episode.status === 'auto_completed' ? 'auto_completed' : 'completed',
    completedAt: episode.completedAt || new Date().toISOString(),
  };
}

export function addBillToEpisode(episode: Episode, billId: string): Episode {
  if (episode.billIds.includes(billId)) return episode;
  return {
    ...episode,
    billIds: [...episode.billIds, billId],
  };
}

export function calculateEpisodeTotals(episode: Episode): {
  totalBilled: number;
  totalPaid: number;
  totalBalance: number;
} {
  return {
    totalBilled: episode.totalBilled,
    totalPaid: episode.totalPaid,
    totalBalance: episode.totalBilled - episode.totalPaid,
  };
}

export function getRemainingTime(episode: Episode): {
  days: number;
  hours: number;
  isExpired: boolean;
} {
  const now = new Date();
  const expiresAt = new Date(episode.expiresAt);
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, isExpired: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours, isExpired: false };
}
