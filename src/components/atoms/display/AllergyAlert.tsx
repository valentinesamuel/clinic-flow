import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface AllergyAlertProps {
  allergies: string[];
  compact?: boolean;
  maxDisplay?: number;
  className?: string;
}

export function AllergyAlert({
  allergies,
  compact = false,
  maxDisplay = 3,
  className,
}: AllergyAlertProps) {
  if (!allergies || allergies.length === 0) {
    return (
      <span className={cn('text-xs text-success', className)}>
        No known allergies
      </span>
    );
  }

  const displayAllergies = allergies.slice(0, maxDisplay);
  const remaining = allergies.length - maxDisplay;

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs text-destructive font-medium',
          className
        )}
        title={allergies.join(', ')}
      >
        <AlertTriangle className="h-3 w-3" />
        {allergies.length} allerg{allergies.length === 1 ? 'y' : 'ies'}
      </span>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayAllergies.map((allergy, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20"
        >
          <AlertTriangle className="h-3 w-3" />
          {allergy}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive"
          title={allergies.slice(maxDisplay).join(', ')}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}
