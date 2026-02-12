import { cn } from '@/lib/utils';
import { HMOCoverageType } from '@/types/billing.types';

interface HMOCoverageTypeBadgeProps {
  coverageType: HMOCoverageType;
  percentage?: number;
  flatAmount?: number;
  className?: string;
}

const coverageConfig: Record<HMOCoverageType, { label: string; bg: string; text: string }> = {
  full: { label: 'Full', bg: 'bg-green-500/10', text: 'text-green-600' },
  partial_percent: { label: '', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  partial_flat: { label: '', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  none: { label: 'Not Covered', bg: 'bg-destructive/10', text: 'text-destructive' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HMOCoverageTypeBadge({
  coverageType,
  percentage,
  flatAmount,
  className,
}: HMOCoverageTypeBadgeProps) {
  const config = coverageConfig[coverageType];

  let label = config.label;
  if (coverageType === 'partial_percent' && percentage !== undefined) {
    label = `${percentage}%`;
  } else if (coverageType === 'partial_flat' && flatAmount !== undefined) {
    label = `${formatCurrency(flatAmount)} cap`;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium px-2.5 py-1 text-xs',
        config.bg,
        config.text,
        className
      )}
    >
      {label}
    </span>
  );
}
