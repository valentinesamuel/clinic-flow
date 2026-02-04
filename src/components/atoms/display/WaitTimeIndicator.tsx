import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { WAIT_TIME_THRESHOLDS } from '@/constants/designSystem';

interface WaitTimeIndicatorProps {
  minutes: number;
  showIcon?: boolean;
  compact?: boolean;
  className?: string;
}

const getWaitTimeStyle = (minutes: number) => {
  if (minutes <= WAIT_TIME_THRESHOLDS.good) {
    return {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
    };
  }
  if (minutes <= WAIT_TIME_THRESHOLDS.warning) {
    return {
      bg: 'bg-warning/10',
      text: 'text-warning',
      dot: 'bg-warning',
    };
  }
  return {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    dot: 'bg-destructive',
  };
};

export function WaitTimeIndicator({
  minutes,
  showIcon = true,
  compact = false,
  className,
}: WaitTimeIndicatorProps) {
  const styles = getWaitTimeStyle(minutes);

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs font-medium',
          styles.text,
          className
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
        {minutes}m
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
        styles.bg,
        styles.text,
        className
      )}
    >
      {showIcon && <Clock className="h-3 w-3" />}
      {minutes < 60 ? (
        <span>{minutes} min</span>
      ) : (
        <span>
          {Math.floor(minutes / 60)}h {minutes % 60}m
        </span>
      )}
    </span>
  );
}
