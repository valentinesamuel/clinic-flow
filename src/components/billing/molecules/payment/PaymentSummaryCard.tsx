import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaymentItem } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { AmountBreakdown } from './AmountBreakdown';

interface PaymentSummaryCardProps {
  patient: Patient;
  items: PaymentItem[];
  total: number;
  discount?: number;
  tax?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentSummaryCard({ patient, items, total, discount = 0, tax = 0 }: PaymentSummaryCardProps) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">COLLECT PAYMENT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Patient:</span> {patient.firstName} {patient.lastName}
          </p>
          <p>
            <span className="font-medium text-foreground">MRN:</span> {patient.mrn}
          </p>
        </div>

        <Separator />

        {/* Service Items */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Services:</p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  • {item.description}
                  {item.quantity > 1 && ` (×${item.quantity})`}
                </span>
                <span className="font-medium">{formatCurrency(item.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Amount Breakdown */}
        <AmountBreakdown
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          total={total}
        />
      </CardContent>
    </Card>
  );
}
