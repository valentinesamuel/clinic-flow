import { cn } from '@/lib/utils';
import { Droplet } from 'lucide-react';
import { BloodGroup } from '@/types/patient.types';

interface BloodTypeDisplayProps {
  bloodGroup: BloodGroup;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function BloodTypeDisplay({
  bloodGroup,
  showIcon = true,
  size = 'md',
  className,
}: BloodTypeDisplayProps) {
  if (bloodGroup === 'unknown') {
    return (
      <span className={cn('text-muted-foreground', sizeStyles[size], className)}>
        Unknown
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-destructive font-medium',
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <Droplet className={cn(iconSizes[size], 'fill-current')} />}
      {bloodGroup}
    </span>
  );
}
