import { cn } from '@/lib/utils';
import { HMOVerification, ServiceCategory } from '@/types/billing.types';
import { Check, AlertTriangle, X } from 'lucide-react';

interface HMOCoverageDisplayProps {
  verification: HMOVerification;
  service: ServiceCategory;
}

const SERVICE_LABELS: Record<ServiceCategory, string> = {
  consultation: 'Consultations',
  lab: 'Lab Tests',
  pharmacy: 'Pharmacy',
  procedure: 'Procedures',
  admission: 'Admission',
  other: 'Other Services',
};

export function HMOCoverageDisplay({ verification, service }: HMOCoverageDisplayProps) {
  const isCovered = verification.coveredServices.includes(service);
  const isPharmacy = service === 'pharmacy';
  const hasCoPayment = isCovered && isPharmacy && verification.coPayPercentage > 0;

  // Not covered
  if (!isCovered) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-destructive" />
          <span className="font-medium text-destructive">
            {SERVICE_LABELS[service]}: Not Covered
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Full payment required</p>
      </div>
    );
  }

  // Covered with co-pay (pharmacy)
  if (hasCoPayment) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="font-medium text-yellow-700">
            {SERVICE_LABELS[service]}: Partial Coverage
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Patient pays {verification.coPayPercentage}% co-payment
        </p>
      </div>
    );
  }

  // Fully covered
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-600" />
        <span className="font-medium text-green-700">
          {SERVICE_LABELS[service]}: Covered (100%)
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">No payment required</p>
    </div>
  );
}
