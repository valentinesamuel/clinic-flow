import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '@/types/billing.types';

interface ReceiptTotalsProps {
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  amountPaid: number;
  change?: number;
  paymentMethod: PaymentMethod;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'POS',
  transfer: 'Transfer',
  hmo: 'HMO',
  corporate: 'Corporate',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReceiptTotals({
  subtotal,
  discount = 0,
  tax = 0,
  total,
  amountPaid,
  change = 0,
  paymentMethod,
}: ReceiptTotalsProps) {
  return (
    <div className="font-mono text-xs space-y-1">
      <Separator />

      {/* Subtotal */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount:</span>
          <span className="text-destructive">-{formatCurrency(discount)}</span>
        </div>
      )}

      {/* Tax */}
      {tax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax:</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      )}

      {/* Total - emphasized with double line */}
      <div className="border-t-2 border-foreground pt-1">
        <div className="flex justify-between text-sm">
          <span className="font-bold">TOTAL:</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      <Separator />

      {/* Amount Paid */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Amount Paid ({PAYMENT_METHOD_LABELS[paymentMethod]}):
        </span>
        <span>{formatCurrency(amountPaid)}</span>
      </div>

      {/* Change */}
      {change > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Change:</span>
          <span className="text-green-600 font-medium">{formatCurrency(change)}</span>
        </div>
      )}
    </div>
  );
}
