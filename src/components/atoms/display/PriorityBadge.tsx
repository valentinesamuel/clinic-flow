import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Minus } from 'lucide-react';
import { QueuePriority } from '@/types/queue.types';
import { PRIORITY_STYLES } from '@/constants/designSystem';

interface PriorityBadgeProps {
  priority: QueuePriority;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const priorityLabels: Record<QueuePriority, string> = {
  normal: 'Normal',
  high: 'High',
  emergency: 'Emergency',
};

const priorityIcons: Record<QueuePriority, React.ReactNode> = {
  normal: <Minus className="h-3 w-3" />,
  high: <AlertTriangle className="h-3 w-3" />,
  emergency: <AlertCircle className="h-3 w-3" />,
};

export function PriorityBadge({
  priority,
  size = 'md',
  showIcon = true,
  className,
}: PriorityBadgeProps) {
  const styles = PRIORITY_STYLES[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        priority === 'emergency' && 'animate-pulse',
        className
      )}
    >
      {showIcon && priorityIcons[priority]}
      {priorityLabels[priority]}
    </span>
  );
}
