import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { getRemainingTime } from '@/utils/episodeLifecycle';
import { Episode } from '@/types/episode.types';

interface EpisodeTimerBadgeProps {
  episode: Episode;
  className?: string;
}

export function EpisodeTimerBadge({ episode, className }: EpisodeTimerBadgeProps) {
  const { days, hours, isExpired } = getRemainingTime(episode);

  if (episode.status === 'completed' || episode.status === 'auto_completed') {
    return null;
  }

  const label = isExpired
    ? 'Expired'
    : days > 0
      ? `${days}d ${hours}h left`
      : `${hours}h left`;

  const isUrgent = !isExpired && days === 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium px-2.5 py-1 text-xs',
        isExpired
          ? 'bg-destructive/10 text-destructive'
          : isUrgent
            ? 'bg-amber-500/10 text-amber-600'
            : 'bg-muted text-muted-foreground',
        className
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
