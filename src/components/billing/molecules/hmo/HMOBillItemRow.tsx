import { BillItem } from '@/types/billing.types';
import { HMOItemStatusBadge } from '@/components/atoms/display/HMOItemStatusBadge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface HMOBillItemRowProps {
  item: BillItem;
  onToggleOptOut?: (itemId: string) => void;
  readOnly?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HMOBillItemRow({ item, onToggleOptOut, readOnly = false }: HMOBillItemRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium truncate">{item.description}</p>
          {item.hmoStatus && <HMOItemStatusBadge status={item.hmoStatus} />}
        </div>
        <p className="text-xs text-muted-foreground">
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </p>
        {item.hmoStatus && item.hmoStatus !== 'not_covered' && (
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-green-600">
              HMO: {formatCurrency(item.hmoCoveredAmount || 0)}
            </span>
            <span className="text-amber-600">
              Patient: {formatCurrency(item.patientLiabilityAmount || 0)}
            </span>
          </div>
        )}
        {item.hmoStatus === 'not_covered' && (
          <p className="text-xs text-destructive mt-1">
            Patient pays: {formatCurrency(item.total)}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium">{formatCurrency(item.total)}</p>
        {!readOnly && onToggleOptOut && (
          <div className="flex items-center gap-1.5 mt-1 justify-end">
            <Label className="text-[10px] text-muted-foreground">Self-pay</Label>
            <Switch
              checked={item.isOptedOutOfHMO || false}
              onCheckedChange={() => onToggleOptOut(item.id)}
              className="scale-75"
            />
          </div>
        )}
      </div>
    </div>
  );
}
