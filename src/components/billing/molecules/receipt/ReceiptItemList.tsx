import { PaymentItem } from '@/types/billing.types';
import { Separator } from '@/components/ui/separator';

interface ReceiptItemListProps {
  items: PaymentItem[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReceiptItemList({ items }: ReceiptItemListProps) {
  return (
    <div className="font-mono text-xs space-y-2">
      <Separator />
      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
        SERVICES
      </p>
      <Separator />

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            {/* Main Item */}
            <div className="flex justify-between">
              <span className="flex-1 truncate">
                {item.description}
                {item.quantity > 1 && ` (×${item.quantity})`}
              </span>
              <span className="font-medium ml-2">{formatCurrency(item.total)}</span>
            </div>

            {/* Sub-items (if any) */}
            {item.subItems && item.subItems.length > 0 && (
              <ul className="ml-2 space-y-0.5 text-muted-foreground">
                {item.subItems.map((subItem) => (
                  <li key={subItem.id} className="flex justify-between">
                    <span className="truncate">└─ {subItem.description}</span>
                    <span className="ml-2">{formatCurrency(subItem.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
