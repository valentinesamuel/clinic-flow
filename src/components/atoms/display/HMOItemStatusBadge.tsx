import { cn } from '@/lib/utils';
import { HMOItemStatus } from '@/types/billing.types';

interface HMOItemStatusBadgeProps {
  status: HMOItemStatus;
  className?: string;
}

const statusConfig: Record<HMOItemStatus, { label: string; bg: string; text: string }> = {
  covered: { label: 'Covered', bg: 'bg-green-500/10', text: 'text-green-600' },
  partial: { label: 'Partial', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  not_covered: { label: 'Not Covered', bg: 'bg-destructive/10', text: 'text-destructive' },
  opted_out: { label: 'Opted Out', bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function HMOItemStatusBadge({ status, className }: HMOItemStatusBadgeProps) {
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
