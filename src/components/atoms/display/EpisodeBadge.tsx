import { cn } from '@/lib/utils';
import { EpisodeStatus } from '@/types/episode.types';

interface EpisodeBadgeProps {
  status: EpisodeStatus;
  className?: string;
}

const statusConfig: Record<EpisodeStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-primary/10', text: 'text-primary' },
  pending_results: { label: 'Pending Results', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  follow_up: { label: 'Follow-up', bg: 'bg-purple-500/10', text: 'text-purple-600' },
  completed: { label: 'Completed', bg: 'bg-green-500/10', text: 'text-green-600' },
  auto_completed: { label: 'Auto-Completed', bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function EpisodeBadge({ status, className }: EpisodeBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium px-2.5 py-1 text-xs',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
