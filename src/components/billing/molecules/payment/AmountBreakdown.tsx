import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface AmountBreakdownProps {
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  showHMO?: boolean;
  hmoCoverage?: number;
  patientLiability?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AmountBreakdown({
  subtotal,
  discount = 0,
  tax = 0,
  total,
  showHMO = false,
  hmoCoverage = 0,
  patientLiability,
}: AmountBreakdownProps) {
  const actualPatientLiability = patientLiability ?? (showHMO ? total - hmoCoverage : total);

  return (
    <div className="bg-background border rounded-lg p-4 space-y-2">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal:</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Discount:</span>
          <span className="font-medium text-destructive">-{formatCurrency(discount)}</span>
        </div>
      )}

      {/* Tax */}
      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax:</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between">
        <span className="text-lg font-bold">TOTAL:</span>
        <span className="text-lg font-bold">{formatCurrency(total)}</span>
      </div>

      {/* HMO Section */}
      {showHMO && hmoCoverage > 0 && (
        <>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">HMO Coverage:</span>
            <span className="font-medium text-purple-600">-{formatCurrency(hmoCoverage)}</span>
          </div>
          <div className="bg-primary/10 rounded-md p-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-primary">Patient Pays:</span>
              <span className="font-bold text-primary">{formatCurrency(actualPatientLiability)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
