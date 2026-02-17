import { useState } from 'react';
import { AlertTriangle, Phone, Mail, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { HMOClaim, WithdrawalReason, HMOProviderExtended } from '@/types/billing.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHMOProviders } from '@/hooks/queries/useReferenceQueries';

interface ClaimWithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: HMOClaim | null;
  onWithdraw: (reason: WithdrawalReason, notes?: string) => void;
  onRequestRetraction: (reason: WithdrawalReason, notes: string) => void;
  onConvertToPrivate?: () => void;
}

const withdrawalReasons: { value: WithdrawalReason; label: string }[] = [
  { value: 'patient_self_pay', label: 'Patient opted for self-pay' },
  { value: 'hospital_cancelled', label: 'Claim submitted in error' },
  { value: 'claim_error', label: 'Bill needs correction' },
  { value: 'treatment_changed', label: 'Treatment plan changed' },
];

export function ClaimWithdrawalModal({
  open,
  onOpenChange,
  claim,
  onWithdraw,
  onRequestRetraction,
  onConvertToPrivate,
}: ClaimWithdrawalModalProps) {
  const [reason, setReason] = useState<WithdrawalReason>('patient_self_pay');
  const [notes, setNotes] = useState('');
  const [confirmContact, setConfirmContact] = useState(false);
  const { data: hmoProviders = [] } = useHMOProviders();

  if (!claim) return null;

  const provider = (hmoProviders as HMOProviderExtended[]).find((p) => p.id === claim.hmoProviderId);
  const isSubmitted = claim.status === 'submitted';
  const isProcessing = claim.status === 'processing';
  const isApproved = claim.status === 'approved';

  // Submitted claims can be cancelled instantly
  // Processing/Approved claims require retraction request
  const needsRetraction = isProcessing || isApproved;
  const canInstantCancel = isSubmitted;

  const handleSubmit = (): void => {
    if (needsRetraction) {
      onRequestRetraction(reason, notes);
    } else {
      onWithdraw(reason, notes || undefined);
    }
    onOpenChange(false);
    resetForm();
  };

  const resetForm = (): void => {
    setReason('patient_self_pay');
    setNotes('');
    setConfirmContact(false);
  };

  const canSubmit = needsRetraction ? (confirmContact && notes.trim().length > 0) : !!reason;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {needsRetraction ? 'Request Retraction' : 'Cancel Claim'}
          </DialogTitle>
          <DialogDescription>
            {claim.claimNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Warning for Approved Claims */}
          {isApproved && (
            <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>This claim has been APPROVED</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                To withdraw, you must:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Contact {claim.hmoProviderName} via their provider portal or relationship manager</li>
                  <li>Request that funds NOT be released</li>
                  <li>Void the HMO invoice</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          {/* Status Warning for Processing Claims */}
          {isProcessing && (
            <Alert className="border-blue-500 bg-blue-50 text-blue-900">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Claim is being processed</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                This claim is currently being reviewed by {claim.hmoProviderName}. 
                A withdrawal request will be submitted.
              </AlertDescription>
            </Alert>
          )}

          {/* Instant Cancel for Submitted */}
          {canInstantCancel && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Quick Cancellation Available</AlertTitle>
              <AlertDescription className="text-sm">
                This claim is still pending and can be cancelled immediately.
              </AlertDescription>
            </Alert>
          )}

          {/* HMO Contact Details (for retraction) */}
          {needsRetraction && provider && (
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">HMO Contact Details</h4>
                <Badge variant="outline">{provider.code}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.contactPhone}</span>
                  {provider.relationshipManagerPhone && (
                    <span className="text-muted-foreground">
                      (RM: {provider.relationshipManagerPhone})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.retractionEmail || provider.contactEmail}</span>
                </div>
                {provider.portalUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={provider.portalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Provider Portal
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-3">
            <Label>Reason for {needsRetraction ? 'retraction' : 'cancellation'}</Label>
            <RadioGroup value={reason} onValueChange={(v) => setReason(v as WithdrawalReason)}>
              {withdrawalReasons.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes {needsRetraction ? '(required)' : '(optional)'}
            </Label>
            <Textarea
              id="notes"
              placeholder={needsRetraction 
                ? "Explain the reason for retraction. This will be shared with the HMO..."
                : "Add any additional notes..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Confirmation Checkbox (for retraction) */}
          {needsRetraction && (
            <div className="flex items-start space-x-2 p-3 rounded-lg border bg-muted/30">
              <Checkbox
                id="confirmContact"
                checked={confirmContact}
                onCheckedChange={(checked) => setConfirmContact(!!checked)}
              />
              <Label htmlFor="confirmContact" className="text-sm font-normal leading-relaxed cursor-pointer">
                I confirm I will contact the HMO to complete this retraction request. 
                The claim status will be updated to "Retracted" pending HMO confirmation.
              </Label>
            </div>
          )}

          {/* Convert to Private Option */}
          {(reason === 'patient_self_pay') && onConvertToPrivate && (
            <Alert className="border-primary/30 bg-primary/5">
              <AlertTitle className="text-sm">Convert to Private Bill?</AlertTitle>
              <AlertDescription className="text-sm">
                After withdrawal, you can generate a private bill for the patient to pay out of pocket.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant={needsRetraction ? 'default' : 'destructive'}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {needsRetraction ? 'Submit Retraction Request' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
