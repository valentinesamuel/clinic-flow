import { cn } from '@/lib/utils';
import { PaymentMethod } from '@/types/billing.types';
import { Banknote, CreditCard, Building2, Shield } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: PaymentMethod[];
}

const PAYMENT_METHODS: { method: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { method: 'cash', label: 'Cash', icon: <Banknote className="h-6 w-6" /> },
  { method: 'card', label: 'POS', icon: <CreditCard className="h-6 w-6" /> },
  { method: 'transfer', label: 'Transfer', icon: <Building2 className="h-6 w-6" /> },
  { method: 'hmo', label: 'HMO', icon: <Shield className="h-6 w-6" /> },
];

export function PaymentMethodSelector({ selected, onChange, disabled = [] }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAYMENT_METHODS.map(({ method, label, icon }) => {
        const isSelected = selected === method;
        const isDisabled = disabled.includes(method);

        return (
          <button
            key={method}
            type="button"
            onClick={() => !isDisabled && onChange(method)}
            disabled={isDisabled}
            className={cn(
              'flex flex-col items-center justify-center h-20 rounded-lg border-2 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              isSelected && 'bg-primary text-primary-foreground border-primary shadow-md',
              !isSelected && !isDisabled && 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:bg-accent/50',
              isDisabled && 'bg-muted opacity-50 cursor-not-allowed'
            )}
          >
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
