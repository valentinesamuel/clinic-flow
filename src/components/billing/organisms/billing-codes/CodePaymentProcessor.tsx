// CodePaymentProcessor - Process payment by billing code at cashier

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BillingCodeEntry } from '@/types/cashier.types';
import { PaymentMethod } from '@/types/billing.types';
import { useBillingCodes, useBill } from '@/hooks/queries/useBillQueries';
import { PaymentMethodSelector } from '@/components/billing/molecules/payment/PaymentMethodSelector';
import { ChangeCalculator } from '@/components/billing/molecules/payment/ChangeCalculator';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodePaymentProcessorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (codeEntry: BillingCodeEntry, receiptNumber: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RCP-${year}-${random}`;
}

export function CodePaymentProcessor({
  open,
  onOpenChange,
  onComplete,
}: CodePaymentProcessorProps) {
  const { data: billingCodes = [] } = useBillingCodes();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [codeInput, setCodeInput] = useState('');
  const [codeEntry, setCodeEntry] = useState<BillingCodeEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [change, setChange] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleLookup = () => {
    setError(null);
    const code = codeInput.toUpperCase().trim();
    const entry = (billingCodes as any[]).find((e: any) => e.code === code) || null;

    if (!entry) {
      setError('Billing code not found. Please check and try again.');
      return;
    }

    if (entry.status === 'paid') {
      setError('This billing code has already been paid.');
      return;
    }

    if (entry.status === 'expired') {
      setError('This billing code has expired. Please request a new code.');
      return;
    }

    if (new Date(entry.expiresAt) < new Date()) {
      setError('This billing code has expired. Please request a new code.');
      return;
    }

    setCodeEntry(entry);
    setStep(2);
  };

  const handleProcessPayment = () => {
    if (!codeEntry) return;

    // Validate based on payment method
    if (paymentMethod === 'cash') {
      const amountDue = codeEntry.patientLiability || codeEntry.amount;
      if (amountReceived < amountDue) {
        setError('Amount received is less than amount due');
        return;
      }
    }

    if ((paymentMethod === 'card' || paymentMethod === 'transfer') && !referenceNumber) {
      setError('Please enter reference number');
      return;
    }

    const receipt = generateReceiptNumber();
    setReceiptNumber(receipt);
    setStep(3);
  };

  const handleComplete = () => {
    if (codeEntry) {
      onComplete(codeEntry, receiptNumber);
    }
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setCodeInput('');
    setCodeEntry(null);
    setError(null);
    setPaymentMethod('cash');
    setAmountReceived(0);
    setChange(0);
    setReferenceNumber('');
    setReceiptNumber('');
    onOpenChange(false);
  };

  const amountDue = codeEntry?.patientLiability || codeEntry?.amount || 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Enter Billing Code'}
            {step === 2 && `Code Found: ${codeEntry?.code}`}
            {step === 3 && '✓ Payment Successful'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Enter Code */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billing-code">Billing Code</Label>
              <Input
                id="billing-code"
                placeholder="e.g. PH3K7M2Q"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                className="text-lg font-mono tracking-widest text-center"
                maxLength={8}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 2: Code Found - Payment */}
        {step === 2 && codeEntry && (
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <p className="font-medium">{codeEntry.patientName}</p>
              <p className="text-sm text-muted-foreground">{codeEntry.patientMrn}</p>
              <Badge variant="outline" className="capitalize">
                {codeEntry.department}
              </Badge>
            </div>

            <Separator />

            {/* Bill Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Amount</span>
                <span>{formatCurrency(codeEntry.amount)}</span>
              </div>
              {codeEntry.hmoCoverage && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>HMO Coverage (90%)</span>
                  <span>-{formatCurrency(codeEntry.hmoCoverage)}</span>
                </div>
              )}
            </div>

            <div
              className={cn(
                'p-4 rounded-lg text-center',
                'bg-primary/10 border border-primary/20'
              )}
            >
              <p className="text-sm text-muted-foreground mb-1">Patient Pays</p>
              <p className="text-3xl font-bold">{formatCurrency(amountDue)}</p>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <div className="flex gap-2">
                {(['cash', 'card', 'transfer'] as PaymentMethod[]).map((method) => (
                  <Button
                    key={method}
                    variant={paymentMethod === method ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod(method)}
                    className="flex-1 capitalize"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <ChangeCalculator
                totalDue={amountDue}
                onAmountReceived={(amount, changeAmount) => {
                  setAmountReceived(amount);
                  setChange(changeAmount);
                }}
              />
            )}

            {/* Card/Transfer Payment */}
            {(paymentMethod === 'card' || paymentMethod === 'transfer') && (
              <div className="space-y-2">
                <Label htmlFor="ref-num">Reference Number</Label>
                <Input
                  id="ref-num"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter transaction reference"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold">{receiptNumber}</p>
              <p className="text-sm text-muted-foreground">
                Code: {codeEntry?.code} (PAID)
              </p>
              <p className="text-lg font-medium">{formatCurrency(amountDue)}</p>
            </div>

            {paymentMethod === 'cash' && change > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Change: {formatCurrency(change)}
              </Badge>
            )}

            <div className="p-3 bg-green-50 rounded-lg text-green-700 text-sm">
              Patient can now collect their items from{' '}
              {codeEntry?.department === 'pharmacy' ? 'the pharmacist' : 'the laboratory'}
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleLookup} disabled={codeInput.length < 8}>
                <Search className="h-4 w-4 mr-2" />
                Lookup Code
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleProcessPayment}>
                Collect Payment
              </Button>
            </>
          )}
          {step === 3 && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Done
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
