import { cn } from '@/lib/utils';
import { Ticket } from 'lucide-react';

interface QueueNumberProps {
  number: number;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm px-2 py-0.5',
  md: 'text-base px-3 py-1',
  lg: 'text-xl px-4 py-2 font-bold',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function QueueNumber({
  number,
  prefix = '#',
  size = 'md',
  showIcon = false,
  className,
}: QueueNumberProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono font-semibold text-primary bg-primary/10 rounded-md',
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <Ticket className={iconSizes[size]} />}
      <span>
        {prefix}
        {number.toString().padStart(3, '0')}
      </span>
    </span>
  );
}
