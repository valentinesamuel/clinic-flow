import { cn } from '@/lib/utils';

interface PriceTagProps {
  amount: number;
  strikethrough?: number;
  size?: 'sm' | 'md';
}

function formatNGN(amount: number): string {
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}

export function PriceTag({ amount, strikethrough, size = 'sm' }: PriceTagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 font-mono', size === 'sm' ? 'text-xs' : 'text-sm')}>
      {strikethrough != null && strikethrough !== amount && (
        <span className="line-through text-muted-foreground">{formatNGN(strikethrough)}</span>
      )}
      <span className="font-medium">{formatNGN(amount)}</span>
    </span>
  );
}
