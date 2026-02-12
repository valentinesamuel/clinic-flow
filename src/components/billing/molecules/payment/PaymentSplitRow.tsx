import { PaymentSplit, PaymentMethod } from '@/types/billing.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface PaymentSplitRowProps {
  split: PaymentSplit;
  onChange: (split: PaymentSplit) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const methodLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'POS/Card',
  transfer: 'Transfer',
  hmo: 'HMO',
  corporate: 'Corporate',
};

export function PaymentSplitRow({ split, onChange, onRemove, canRemove }: PaymentSplitRowProps) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Select
            value={split.method}
            onValueChange={(value: PaymentMethod) =>
              onChange({ ...split, method: value, referenceNumber: undefined, bank: undefined })
            }
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(methodLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={0}
            value={split.amount || ''}
            onChange={(e) => onChange({ ...split, amount: Number(e.target.value) || 0 })}
            placeholder="Amount"
            className="w-32 h-8 text-xs"
          />
        </div>
        {(split.method === 'card' || split.method === 'transfer') && (
          <Input
            value={split.referenceNumber || ''}
            onChange={(e) => onChange({ ...split, referenceNumber: e.target.value })}
            placeholder={split.method === 'card' ? 'POS Reference' : 'Transfer Reference'}
            className="h-8 text-xs"
          />
        )}
      </div>
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
