import { cn } from '@/lib/utils';
import { Patient } from '@/types/patient.types';
import { InsuranceBadge } from '@/components/atoms/display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HMO_PROVIDERS, formatNaira } from '@/constants/designSystem';

interface PatientInsuranceProps {
  patient: Patient;
  showCard?: boolean;
  compact?: boolean;
  className?: string;
}

export function PatientInsurance({
  patient,
  showCard = true,
  compact = false,
  className,
}: PatientInsuranceProps) {
  const hasInsurance = patient.paymentType === 'hmo' && patient.hmoDetails;

  if (!hasInsurance) {
    return (
      <InsuranceBadge
        status="none"
        compact={compact}
        className={className}
      />
    );
  }

  const { hmoDetails } = patient;
  const isExpired = hmoDetails && new Date(hmoDetails.expiryDate) < new Date();
  const status = isExpired ? 'expired' : hmoDetails?.isActive ? 'active' : 'pending';

  const providerLabel = HMO_PROVIDERS.find(
    (p) => p.value === hmoDetails?.providerId
  )?.label || hmoDetails?.providerName;

  if (compact) {
    return (
      <InsuranceBadge
        status={status}
        providerName={providerLabel}
        compact
        className={className}
      />
    );
  }

  if (!showCard) {
    return (
      <InsuranceBadge
        status={status}
        providerName={providerLabel}
        expiryDate={hmoDetails?.expiryDate}
        className={className}
      />
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          Insurance Details
          <InsuranceBadge status={status} compact />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Provider</span>
          <span className="font-medium">{providerLabel}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Enrollment ID</span>
          <span className="font-mono">{hmoDetails?.enrollmentId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan Type</span>
          <span>{hmoDetails?.planType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expiry Date</span>
          <span className={cn(isExpired && 'text-destructive font-medium')}>
            {new Date(hmoDetails?.expiryDate || '').toLocaleDateString('en-GB')}
          </span>
        </div>
        {hmoDetails?.copayAmount && hmoDetails.copayAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Co-pay Amount</span>
            <span>{formatNaira(hmoDetails.copayAmount)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
