import { cn } from '@/lib/utils';
import { QUEUE_STATUS_STYLES } from '@/constants/designSystem';

type StatusType = 
  | 'waiting' 
  | 'in_progress' 
  | 'paused' 
  | 'completed' 
  | 'no_show'
  | 'pending'
  | 'active'
  | 'cancelled'
  | 'draft'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const defaultLabels: Record<StatusType, string> = {
  waiting: 'Waiting',
  in_progress: 'In Progress',
  paused: 'Paused',
  completed: 'Completed',
  no_show: 'No Show',
  pending: 'Pending',
  active: 'Active',
  cancelled: 'Cancelled',
  draft: 'Draft',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  waiting: { bg: 'bg-muted', text: 'text-muted-foreground' },
  in_progress: { bg: 'bg-primary/10', text: 'text-primary' },
  paused: { bg: 'bg-warning/10', text: 'text-warning' },
  completed: { bg: 'bg-success/10', text: 'text-success' },
  no_show: { bg: 'bg-muted', text: 'text-muted-foreground' },
  pending: { bg: 'bg-warning/10', text: 'text-warning' },
  active: { bg: 'bg-success/10', text: 'text-success' },
  cancelled: { bg: 'bg-destructive/10', text: 'text-destructive' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground' },
  approved: { bg: 'bg-success/10', text: 'text-success' },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function StatusBadge({
  status,
  label,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const styles = statusStyles[status] || statusStyles.waiting;
  const displayLabel = label || defaultLabels[status] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        styles.bg,
        styles.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
