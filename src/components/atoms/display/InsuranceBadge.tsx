import { cn } from '@/lib/utils';
import { Shield, ShieldCheck, ShieldX, ShieldAlert, Wallet } from 'lucide-react';
import { PaymentType } from '@/types/patient.types';

type InsuranceStatus = 'active' | 'expired' | 'pending' | 'none';

interface InsuranceBadgeProps {
  // Support either status-based or paymentType-based usage
  status?: InsuranceStatus;
  paymentType?: PaymentType;
  providerName?: string;
  hmoName?: string; // Alias for providerName
  expiryDate?: string;
  compact?: boolean;
  className?: string;
}

const statusConfig: Record<
  InsuranceStatus,
  { icon: React.ReactNode; label: string; styles: string }
> = {
  active: {
    icon: <ShieldCheck className="h-3 w-3" />,
    label: 'Active',
    styles: 'bg-primary/10 text-primary border-primary/20',
  },
  expired: {
    icon: <ShieldX className="h-3 w-3" />,
    label: 'Expired',
    styles: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    icon: <ShieldAlert className="h-3 w-3" />,
    label: 'Pending',
    styles: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  none: {
    icon: <Wallet className="h-3 w-3" />,
    label: 'Cash',
    styles: 'bg-muted text-muted-foreground border-border',
  },
};

export function InsuranceBadge({
  status,
  paymentType,
  providerName,
  hmoName,
  expiryDate,
  compact = true,
  className,
}: InsuranceBadgeProps) {
  // Determine status from paymentType if not explicitly provided
  let resolvedStatus: InsuranceStatus = status || 'none';
  let displayName = providerName || hmoName;
  
  if (!status && paymentType) {
    if (paymentType === 'hmo') {
      resolvedStatus = 'active';
    } else if (paymentType === 'corporate') {
      resolvedStatus = 'active';
      displayName = displayName || 'Corporate';
    } else {
      resolvedStatus = 'none';
    }
  }

  const config = statusConfig[resolvedStatus];

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
          config.styles,
          className
        )}
        title={displayName ? `${displayName} - ${config.label}` : config.label}
      >
        {config.icon}
        {resolvedStatus === 'none' ? 'Cash' : displayName || config.label}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border',
        config.styles,
        className
      )}
    >
      {config.icon}
      <div className="flex flex-col">
        <span className="text-xs font-medium">
          {displayName || config.label}
        </span>
        {expiryDate && resolvedStatus === 'active' && (
          <span className="text-xs opacity-75">
            Expires: {new Date(expiryDate).toLocaleDateString('en-GB')}
          </span>
        )}
      </div>
    </div>
  );
}
