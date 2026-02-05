import { useState } from 'react';
import { Loader2, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HMOProviderSelector } from '@/components/billing/molecules/hmo/HMOProviderSelector';
import { HMOVerificationCard } from '@/components/billing/molecules/hmo/HMOVerificationCard';
import { HMOCoverageDisplay } from '@/components/billing/molecules/hmo/HMOCoverageDisplay';
import { HMOVerification, ServiceCategory } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { getHMOProviderById } from '@/data/hmo-providers';

interface HMOVerificationFlowProps {
  patient: Patient;
  service: ServiceCategory;
  onVerified: (verification: HMOVerification) => void;
  onCancel: () => void;
  open: boolean;
}

type FlowStep = 'select' | 'verifying' | 'success' | 'failed';

export function HMOVerificationFlow({
  patient,
  service,
  onVerified,
  onCancel,
  open,
}: HMOVerificationFlowProps) {
  const [step, setStep] = useState<FlowStep>('select');
  const [providerId, setProviderId] = useState<string>('');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [verification, setVerification] = useState<HMOVerification | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const provider = providerId ? getHMOProviderById(providerId) : undefined;

  const handleVerify = async () => {
    if (!providerId || !policyNumber) return;

    setStep('verifying');

    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate verification result (80% success rate for demo)
    const isSuccess = Math.random() > 0.2;
    const isExpired = !isSuccess && Math.random() > 0.5;

    if (isSuccess && provider) {
      const mockVerification: HMOVerification = {
        id: `ver-${Date.now()}`,
        providerId: provider.id,
        providerName: provider.name,
        policyNumber,
        enrollmentId: `${provider.code}-${new Date().getFullYear()}-${policyNumber.slice(-6)}`,
        status: 'active',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        coveredServices: ['consultation', 'lab', 'pharmacy', 'procedure'],
        coPayPercentage: 10, // Standard Nigerian NHIA 10% co-pay for pharmacy
        preAuthCode: `PA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        verifiedAt: new Date().toISOString(),
      };

      setVerification(mockVerification);
      setStep('success');
    } else {
      setErrorMessage(
        isExpired
          ? `Policy expired on ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
          : 'Unable to verify policy. Please check the policy number and try again.'
      );
      setStep('failed');
    }
  };

  const handleProceedCash = () => {
    onCancel();
  };

  const handleContinue = () => {
    if (verification) {
      onVerified(verification);
    }
  };

  const handleRetry = () => {
    setStep('select');
    setErrorMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {step === 'select' && 'SELECT HMO PROVIDER'}
            {step === 'verifying' && 'VERIFYING HMO...'}
            {step === 'success' && 'HMO VERIFIED'}
            {step === 'failed' && 'VERIFICATION FAILED'}
          </DialogTitle>
        </DialogHeader>

        {/* Step: Select Provider */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Patient: <span className="font-medium text-foreground">{patient.firstName} {patient.lastName}</span></p>
            </div>

            <div className="space-y-2">
              <Label>HMO Provider</Label>
              <HMOProviderSelector selected={providerId} onChange={setProviderId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-number">Policy Number</Label>
              <Input
                id="policy-number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                placeholder="e.g. NHIA-12345-6789"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={!providerId || !policyNumber}
              >
                Verify HMO →
              </Button>
            </div>
          </div>
        )}

        {/* Step: Verifying */}
        {step === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Checking {provider?.name} database...</p>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && verification && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Verification Successful</span>
            </div>

            <HMOVerificationCard verification={verification} />
            <HMOCoverageDisplay verification={verification} service={service} />

            <div className="flex justify-end">
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step: Failed */}
        {step === 'failed' && (
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Verification Failed</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Options:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Proceed as Cash Patient</li>
                <li>Try again with correct details</li>
                <li>Cancel and contact HMO</li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleRetry}>
                Try Again
              </Button>
              <Button onClick={handleProceedCash}>
                Proceed Cash
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
