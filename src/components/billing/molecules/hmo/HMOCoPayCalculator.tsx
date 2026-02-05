import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Pill } from 'lucide-react';

interface HMOCoPayCalculatorProps {
  total: number;
  coPayPercentage: number;
  onChange: (coPayAmount: number) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HMOCoPayCalculator({ total, coPayPercentage, onChange }: HMOCoPayCalculatorProps) {
  const coPayAmount = Math.round(total * (coPayPercentage / 100));
  const hmoCoverage = total - coPayAmount;

  useEffect(() => {
    onChange(coPayAmount);
  }, [coPayAmount, onChange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Pill className="h-5 w-5" />
          PHARMACY CO-PAYMENT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Pharmacy:</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">HMO Covers ({100 - coPayPercentage}%):</span>
          <span className="font-medium text-purple-600">-{formatCurrency(hmoCoverage)}</span>
        </div>

        <Separator />

        <div className="bg-primary/10 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary">
              PATIENT PAYS ({coPayPercentage}%):
            </span>
            <span className="text-xl font-bold text-primary">{formatCurrency(coPayAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
