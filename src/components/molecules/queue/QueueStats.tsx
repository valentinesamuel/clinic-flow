import { cn } from '@/lib/utils';
import { QueueStats as QueueStatsType, QueueConfig } from '@/types/queue.types';
import { Users, Clock, UserCheck, AlertTriangle } from 'lucide-react';

interface QueueStatsProps {
  stats: QueueStatsType;
  config: QueueConfig;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

function StatCard({ label, value, icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-muted/50 text-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        variantStyles[variant]
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function QueueStats({ stats, config, className }: QueueStatsProps) {
  const avgWaitVariant =
    stats.averageWaitTime > config.maxWaitTimeWarning
      ? 'destructive'
      : stats.averageWaitTime > config.maxWaitTimeWarning * 0.7
      ? 'warning'
      : 'success';

  const longestWaitVariant =
    stats.longestWaitTime > config.maxWaitTimeWarning
      ? 'destructive'
      : stats.longestWaitTime > config.maxWaitTimeWarning * 0.7
      ? 'warning'
      : 'default';

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <StatCard
        label="Total in Queue"
        value={stats.total}
        icon={<Users className="h-5 w-5" />}
        variant="default"
      />
      <StatCard
        label="Waiting"
        value={stats.waiting}
        icon={<Clock className="h-5 w-5" />}
        variant={stats.waiting > 10 ? 'warning' : 'default'}
      />
      <StatCard
        label="Avg Wait Time"
        value={`${stats.averageWaitTime} min`}
        icon={<Clock className="h-5 w-5" />}
        variant={avgWaitVariant}
      />
      <StatCard
        label="Longest Wait"
        value={`${stats.longestWaitTime} min`}
        icon={<AlertTriangle className="h-5 w-5" />}
        variant={longestWaitVariant}
      />
      {stats.emergencyCount > 0 && (
        <StatCard
          label="Emergency"
          value={stats.emergencyCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="destructive"
        />
      )}
      {stats.paused > 0 && (
        <StatCard
          label="Paused"
          value={stats.paused}
          icon={<UserCheck className="h-5 w-5" />}
          variant="warning"
        />
      )}
    </div>
  );
}
