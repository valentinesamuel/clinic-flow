import { cn } from '@/lib/utils';
import { Shield, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';

type InsuranceStatus = 'active' | 'expired' | 'pending' | 'none';

interface InsuranceBadgeProps {
  status: InsuranceStatus;
  providerName?: string;
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
    styles: 'bg-success/10 text-success border-success/20',
  },
  expired: {
    icon: <ShieldX className="h-3 w-3" />,
    label: 'Expired',
    styles: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    icon: <ShieldAlert className="h-3 w-3" />,
    label: 'Pending',
    styles: 'bg-warning/10 text-warning border-warning/20',
  },
  none: {
    icon: <Shield className="h-3 w-3" />,
    label: 'No Insurance',
    styles: 'bg-muted text-muted-foreground border-border',
  },
};

export function InsuranceBadge({
  status,
  providerName,
  expiryDate,
  compact = false,
  className,
}: InsuranceBadgeProps) {
  const config = statusConfig[status];

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
          config.styles,
          className
        )}
        title={providerName ? `${providerName} - ${config.label}` : config.label}
      >
        {config.icon}
        {status === 'none' ? 'Cash' : providerName || config.label}
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
          {providerName || config.label}
        </span>
        {expiryDate && status === 'active' && (
          <span className="text-xs opacity-75">
            Expires: {new Date(expiryDate).toLocaleDateString('en-GB')}
          </span>
        )}
      </div>
    </div>
  );
}
