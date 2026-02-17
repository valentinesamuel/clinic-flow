import { useState } from 'react';
import { AlertTriangle, CreditCard, Banknote, Building2, Wallet } from 'lucide-react';
import { HMOClaim, PaymentMethod } from '@/types/billing.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNigerianBanks } from '@/hooks/queries/useReferenceQueries';

interface PayOutOfPocketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: HMOClaim | null;
  onConfirm: (paymentMethod: PaymentMethod, referenceNumber?: string, bank?: string) => void;
}

type PrivatePaymentMethod = 'cash' | 'card' | 'transfer';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const paymentMethods: { value: PrivatePaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'cash', label: 'Cash', icon: <Banknote className="h-4 w-4" /> },
  { value: 'card', label: 'POS / Card', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'transfer', label: 'Bank Transfer', icon: <Building2 className="h-4 w-4" /> },
];

export function PayOutOfPocketModal({
  open,
  onOpenChange,
  claim,
  onConfirm,
}: PayOutOfPocketModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<PrivatePaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const { banks } = useNigerianBanks();

  if (!claim) return null;

  const resetForm = () => {
    setStep(1);
    setPaymentMethod('cash');
    setReferenceNumber('');
    setSelectedBank('');
  };

  const handleConfirm = () => {
    onConfirm(
      paymentMethod,
      referenceNumber || undefined,
      selectedBank || undefined
    );
    onOpenChange(false);
    resetForm();
  };

  const canProceed = step === 1 || (
    paymentMethod === 'cash' ||
    (paymentMethod === 'card' && referenceNumber.trim().length > 0) ||
    (paymentMethod === 'transfer' && referenceNumber.trim().length > 0 && selectedBank)
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pay Out of Pocket
          </DialogTitle>
          <DialogDescription>
            Convert HMO claim to private payment
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            {/* Warning */}
            <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-sm">
                This will void the HMO claim and create a private bill for the patient to pay.
              </AlertDescription>
            </Alert>

            {/* Claim Summary */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Claim Number</span>
                <span className="font-medium">{claim.claimNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Patient</span>
                <span className="font-medium">{claim.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">HMO Provider</span>
                <span className="font-medium">{claim.hmoProviderName}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Claim Amount</span>
                <span className="font-semibold text-lg">{formatCurrency(claim.claimAmount)}</span>
              </div>
            </div>

            {claim.denialReason && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">Denial Reason:</p>
                <p className="text-sm text-destructive/80 mt-1">{claim.denialReason}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              The patient will need to pay {formatCurrency(claim.claimAmount)} using one of the available payment methods.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            {/* Amount to Pay */}
            <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(claim.claimAmount)}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(v) => setPaymentMethod(v as PrivatePaymentMethod)}
                className="grid grid-cols-3 gap-2"
              >
                {paymentMethods.map((method) => (
                  <Label
                    key={method.value}
                    htmlFor={method.value}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer
                      hover:bg-accent transition-colors
                      ${paymentMethod === method.value ? 'border-primary bg-primary/5' : ''}
                    `}
                  >
                    <RadioGroupItem value={method.value} id={method.value} className="sr-only" />
                    {method.icon}
                    <span className="text-sm">{method.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Reference Number for Card/Transfer */}
            {(paymentMethod === 'card' || paymentMethod === 'transfer') && (
              <div className="space-y-2">
                <Label htmlFor="reference">
                  {paymentMethod === 'card' ? 'POS Receipt Number' : 'Transaction Reference'}
                </Label>
                <Input
                  id="reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder={paymentMethod === 'card' ? 'e.g. POS-12345678' : 'e.g. TRF-12345678'}
                />
              </div>
            )}

            {/* Bank Selection for Transfer */}
            {paymentMethod === 'transfer' && (
              <div className="space-y-2">
                <Label htmlFor="bank">Bank</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>
                Continue to Payment
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={!canProceed}>
                Confirm Payment
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
