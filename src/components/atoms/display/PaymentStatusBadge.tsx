import { cn } from '@/lib/utils';
import { Check, Clock, Shield, AlertTriangle } from 'lucide-react';
import { PaymentClearanceStatus } from '@/types/queue.types';
import { PAYMENT_STATUS_STYLES } from '@/constants/designSystem';

interface PaymentStatusBadgeProps {
  status: PaymentClearanceStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const statusIcons: Record<PaymentClearanceStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  cleared: <Check className="h-3 w-3" />,
  hmo_verified: <Shield className="h-3 w-3" />,
  emergency_override: <AlertTriangle className="h-3 w-3" />,
};

export function PaymentStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: PaymentStatusBadgeProps) {
  const styles = PAYMENT_STATUS_STYLES[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        styles.bg,
        styles.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {showIcon && statusIcons[status]}
      {styles.label}
    </span>
  );
}
