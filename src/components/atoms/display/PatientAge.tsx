import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { calculateAge } from '@/constants/designSystem';

interface PatientAgeProps {
  dateOfBirth: string;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function PatientAge({
  dateOfBirth,
  showIcon = false,
  showLabel = false,
  className,
}: PatientAgeProps) {
  const age = calculateAge(dateOfBirth);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-muted-foreground',
        className
      )}
    >
      {showIcon && <User className="h-3 w-3" />}
      {showLabel && <span className="text-xs">Age:</span>}
      <span className="font-medium">{age}</span>
      {!showLabel && <span className="text-xs">yrs</span>}
    </span>
  );
}
