import { PaymentSplit, PaymentMethod } from '@/types/billing.types';

interface PaymentAllocationBarProps {
  splits: PaymentSplit[];
  totalDue: number;
}

const methodColors: Record<PaymentMethod, { bg: string; label: string }> = {
  cash: { bg: 'bg-green-500', label: 'Cash' },
  card: { bg: 'bg-blue-500', label: 'Card' },
  transfer: { bg: 'bg-purple-500', label: 'Transfer' },
  hmo: { bg: 'bg-amber-500', label: 'HMO' },
  corporate: { bg: 'bg-cyan-500', label: 'Corporate' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentAllocationBar({ splits, totalDue }: PaymentAllocationBarProps) {
  if (splits.length === 0 || totalDue === 0) return null;

  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full bg-muted overflow-hidden flex">
        {splits.map((split) => {
          const widthPercent = Math.min((split.amount / totalDue) * 100, 100);
          const config = methodColors[split.method];
          return (
            <div
              key={split.id}
              className={`${config.bg} transition-all`}
              style={{ width: `${widthPercent}%` }}
              title={`${config.label}: ${formatCurrency(split.amount)}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        {splits.map((split) => {
          const config = methodColors[split.method];
          return (
            <div key={split.id} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${config.bg}`} />
              <span className="text-muted-foreground">{config.label}</span>
              <span className="font-medium">{formatCurrency(split.amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
