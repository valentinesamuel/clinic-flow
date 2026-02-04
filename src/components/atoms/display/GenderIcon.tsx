import { cn } from '@/lib/utils';
import { Gender } from '@/types/patient.types';

interface GenderIconProps {
  gender: Gender;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const genderConfig: Record<Gender, { symbol: string; label: string; color: string }> = {
  male: { symbol: '♂', label: 'Male', color: 'text-primary' },
  female: { symbol: '♀', label: 'Female', color: 'text-pink-500' },
  other: { symbol: '⚧', label: 'Other', color: 'text-muted-foreground' },
};

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function GenderIcon({
  gender,
  showLabel = false,
  size = 'md',
  className,
}: GenderIconProps) {
  const config = genderConfig[gender];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        config.color,
        sizeStyles[size],
        className
      )}
      title={config.label}
    >
      <span>{config.symbol}</span>
      {showLabel && <span className="text-muted-foreground">{config.label}</span>}
    </span>
  );
}

// Shorthand component for just showing M/F
export function GenderShort({
  gender,
  className,
}: {
  gender: Gender;
  className?: string;
}) {
  const shortLabels: Record<Gender, string> = {
    male: 'M',
    female: 'F',
    other: 'O',
  };

  return (
    <span className={cn('text-muted-foreground font-medium', className)}>
      {shortLabels[gender]}
    </span>
  );
}
