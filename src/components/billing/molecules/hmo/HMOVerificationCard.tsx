import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HMOVerification, ServiceCategory } from '@/types/billing.types';
import { Check, AlertTriangle, Shield, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface HMOVerificationCardProps {
  verification: HMOVerification;
  compact?: boolean;
}

const SERVICE_LABELS: Record<ServiceCategory, string> = {
  consultation: 'Consultations',
  lab: 'Lab Tests',
  pharmacy: 'Pharmacy',
  procedure: 'Procedures',
  admission: 'Admission',
  other: 'Other Services',
};

export function HMOVerificationCard({ verification, compact = false }: HMOVerificationCardProps) {
  const isActive = verification.status === 'active';

  const handleCopyPreAuth = () => {
    if (verification.preAuthCode) {
      navigator.clipboard.writeText(verification.preAuthCode);
      toast({
        title: 'Copied!',
        description: 'Pre-authorization code copied to clipboard',
      });
    }
  };

  // Compact version
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
        isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'
      )}>
        <Shield className="h-4 w-4" />
        <span className="font-medium">{verification.providerName} Verified</span>
        {verification.preAuthCode && (
          <>
            <span className="text-muted-foreground">|</span>
            <code className="font-mono text-xs">{verification.preAuthCode}</code>
          </>
        )}
      </div>
    );
  }

  // Full version
  return (
    <Card className={cn(
      'border',
      isActive ? 'border-green-200 bg-green-50/50' : 'border-destructive/20 bg-destructive/5'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            <span className={cn(
              'font-semibold',
              isActive ? 'text-green-700' : 'text-destructive'
            )}>
              HMO {isActive ? 'VERIFIED' : 'EXPIRED'}
            </span>
          </div>
          <Shield className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Provider Info */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{verification.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Policy:</span>
            <span className="font-medium">{verification.policyNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={isActive ? 'default' : 'destructive'} className="text-xs">
              {isActive ? `Active until ${new Date(verification.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Expired'}
            </Badge>
          </div>
        </div>

        {/* Coverage List */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Coverage:</p>
          <ul className="space-y-1">
            {(['consultation', 'lab', 'pharmacy'] as ServiceCategory[]).map((service) => {
              const isCovered = verification.coveredServices.includes(service);
              const isPharmacy = service === 'pharmacy';

              return (
                <li key={service} className="flex items-center gap-2 text-sm">
                  {isCovered ? (
                    isPharmacy ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    )
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={cn(
                    isPharmacy && isCovered ? 'text-yellow-700' : isCovered ? 'text-green-700' : 'text-destructive'
                  )}>
                    {SERVICE_LABELS[service]}
                    {isPharmacy && isCovered && ` (${verification.coPayPercentage}% Co-pay)`}
                    {!isPharmacy && isCovered && ' (Covered)'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pre-Auth Code */}
        {verification.preAuthCode && (
          <div className="bg-primary/10 rounded-md p-2 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pre-Auth Code:</p>
              <code className="font-mono text-sm font-medium">{verification.preAuthCode}</code>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPreAuth}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
