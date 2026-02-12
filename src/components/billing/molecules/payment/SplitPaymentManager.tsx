import { useState, useEffect } from 'react';
import { PaymentSplit } from '@/types/billing.types';
import { PaymentSplitRow } from './PaymentSplitRow';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplitPaymentManagerProps {
  totalDue: number;
  onSplitsChange: (splits: PaymentSplit[]) => void;
  initialSplits?: PaymentSplit[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateId(): string {
  return `split-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function SplitPaymentManager({
  totalDue,
  onSplitsChange,
  initialSplits,
}: SplitPaymentManagerProps) {
  const [splits, setSplits] = useState<PaymentSplit[]>(
    initialSplits || [{ id: generateId(), method: 'cash', amount: totalDue }]
  );

  useEffect(() => {
    onSplitsChange(splits);
  }, [splits, onSplitsChange]);

  const allocated = splits.reduce((sum, s) => sum + s.amount, 0);
  const remaining = totalDue - allocated;

  const handleAdd = () => {
    if (splits.length >= 4) return;
    setSplits((prev) => [
      ...prev,
      { id: generateId(), method: 'cash', amount: Math.max(0, remaining) },
    ]);
  };

  const handleChange = (index: number, updated: PaymentSplit) => {
    setSplits((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleRemove = (index: number) => {
    setSplits((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {splits.map((split, index) => (
        <PaymentSplitRow
          key={split.id}
          split={split}
          onChange={(s) => handleChange(index, s)}
          onRemove={() => handleRemove(index)}
          canRemove={splits.length > 1}
        />
      ))}

      {splits.length < 4 && (
        <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          Add Payment Method
        </Button>
      )}

      <div className="space-y-1 p-3 rounded-lg border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Due</span>
          <span className="font-medium">{formatCurrency(totalDue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Allocated</span>
          <span className="font-medium">{formatCurrency(allocated)}</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between text-sm font-semibold',
            remaining === 0 && 'text-green-600',
            remaining > 0 && 'text-amber-600',
            remaining < 0 && 'text-destructive'
          )}
        >
          <span>Remaining</span>
          <span>{formatCurrency(remaining)}</span>
        </div>
      </div>
    </div>
  );
}
