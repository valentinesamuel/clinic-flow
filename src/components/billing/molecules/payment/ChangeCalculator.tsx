import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ChangeCalculatorProps {
  totalDue: number;
  onAmountReceived: (amount: number, change: number) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortCurrency(amount: number): string {
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

function generateQuickAmounts(totalDue: number): number[] {
  const amounts: number[] = [];
  const roundedUp5k = Math.ceil(totalDue / 5000) * 5000;
  const roundedUp10k = Math.ceil(totalDue / 10000) * 10000;
  const roundedUp20k = Math.ceil(totalDue / 20000) * 20000;

  // Add unique amounts that are >= totalDue
  if (roundedUp5k >= totalDue && !amounts.includes(roundedUp5k)) amounts.push(roundedUp5k);
  if (roundedUp10k >= totalDue && !amounts.includes(roundedUp10k)) amounts.push(roundedUp10k);
  if (roundedUp20k >= totalDue && !amounts.includes(roundedUp20k)) amounts.push(roundedUp20k);

  // Sort and limit to 3 quick amounts
  return amounts.sort((a, b) => a - b).slice(0, 3);
}

export function ChangeCalculator({ totalDue, onAmountReceived }: ChangeCalculatorProps) {
  const [amountReceived, setAmountReceived] = useState<string>('');
  const numericAmount = parseFloat(amountReceived) || 0;
  const change = numericAmount - totalDue;
  const isValid = numericAmount >= totalDue;
  const quickAmounts = generateQuickAmounts(totalDue);

  useEffect(() => {
    onAmountReceived(numericAmount, Math.max(0, change));
  }, [numericAmount, change, onAmountReceived]);

  const handleQuickAmount = (amount: number) => {
    setAmountReceived(amount.toString());
  };

  const handleExact = () => {
    setAmountReceived(totalDue.toString());
  };

  return (
    <div className="space-y-4">
      {/* Amount Due */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Amount Due:</span>
        <span className="text-lg font-bold">{formatCurrency(totalDue)}</span>
      </div>

      {/* Amount Received Input */}
      <div className="space-y-2">
        <Label htmlFor="amount-received">Amount Received</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
          <Input
            id="amount-received"
            type="number"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            placeholder="0"
            className="pl-8 text-lg h-12 font-medium"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Quick amounts:</Label>
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(amount)}
              className={cn(numericAmount === amount && 'border-primary bg-primary/10')}
            >
              {formatShortCurrency(amount)}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExact}
            className={cn(numericAmount === totalDue && 'border-primary bg-primary/10')}
          >
            Exact
          </Button>
        </div>
      </div>

      {/* Change Display */}
      {amountReceived !== '' && (
        <div
          className={cn(
            'p-3 rounded-lg',
            isValid ? 'bg-green-50 border border-green-200' : 'bg-destructive/10 border border-destructive/20'
          )}
        >
          {isValid ? (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-700">CHANGE DUE:</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(change)}</span>
            </div>
          ) : (
            <p className="text-sm text-destructive font-medium">
              Amount must be at least {formatCurrency(totalDue)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
