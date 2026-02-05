import { useState, useCallback } from 'react';
import { CheckCircle2, ArrowLeft, Printer, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { PaymentMethodSelector } from '@/components/billing/molecules/payment/PaymentMethodSelector';
import { PaymentSummaryCard } from '@/components/billing/molecules/payment/PaymentSummaryCard';
import { ChangeCalculator } from '@/components/billing/molecules/payment/ChangeCalculator';
import { HMOProviderSelector } from '@/components/billing/molecules/hmo/HMOProviderSelector';
import { HMOVerificationCard } from '@/components/billing/molecules/hmo/HMOVerificationCard';
import { ThermalReceipt } from '@/components/billing/organisms/receipt/ThermalReceipt';

import { PaymentMethod, PaymentItem, PaymentClearance, HMOVerification } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { useNigerianBanks } from '@/data/nigerian-banks';
import { getHMOProviderById } from '@/data/hmo-providers';

interface PaymentCollectionFormProps {
  patient: Patient;
  items: PaymentItem[];
  onComplete: (clearance: PaymentClearance) => void;
  onCancel: () => void;
  open: boolean;
}

type Step = 1 | 2 | 3;

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

// Step Indicator Component
function StepIndicator({ step, currentStep }: { step: number; currentStep: number }) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
          isActive && 'bg-primary text-primary-foreground',
          isCompleted && 'bg-primary/20 text-primary',
          !isActive && !isCompleted && 'bg-muted text-muted-foreground'
        )}
      >
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      {step < 3 && (
        <div className={cn(
          'h-0.5 w-8',
          step < currentStep ? 'bg-primary' : 'bg-muted'
        )} />
      )}
    </div>
  );
}

export function PaymentCollectionForm({
  patient,
  items,
  onComplete,
  onCancel,
  open,
}: PaymentCollectionFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [change, setChange] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [hmoProviderId, setHmoProviderId] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [hmoVerification, setHmoVerification] = useState<HMOVerification | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [clearance, setClearance] = useState<PaymentClearance | null>(null);

  const { banks } = useNigerianBanks();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = 0; // Can be extended
  const tax = 0; // Can be extended
  const total = subtotal - discount + tax;

  // Validation for step 2
  const isStep2Valid = useCallback(() => {
    switch (paymentMethod) {
      case 'cash':
        return amountReceived >= total;
      case 'card':
        return referenceNumber.trim().length > 0;
      case 'transfer':
        return selectedBank.length > 0 && referenceNumber.trim().length > 0;
      case 'hmo':
        return hmoVerification !== null && hmoVerification.status === 'active';
      default:
        return false;
    }
  }, [paymentMethod, amountReceived, total, referenceNumber, selectedBank, hmoVerification]);

  // Handle HMO verification
  const handleVerifyHMO = async () => {
    if (!hmoProviderId || !policyNumber) return;

    setIsVerifying(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const provider = getHMOProviderById(hmoProviderId);
    if (!provider) {
      setIsVerifying(false);
      return;
    }

    // Simulate successful verification
    const verification: HMOVerification = {
      id: `ver-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      policyNumber,
      enrollmentId: `${provider.code}-${new Date().getFullYear()}-${policyNumber.slice(-6)}`,
      status: 'active',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      coveredServices: ['consultation', 'lab', 'pharmacy', 'procedure'],
      coPayPercentage: 10,
      preAuthCode: `PA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
    };

    setHmoVerification(verification);
    setIsVerifying(false);
  };

  // Process payment
  const handleProcessPayment = () => {
    const receiptNumber = generateReceiptNumber();
    const actualAmountPaid = paymentMethod === 'cash' ? amountReceived : total;
    const actualChange = paymentMethod === 'cash' ? change : 0;

    const newClearance: PaymentClearance = {
      id: `clr-${Date.now()}`,
      receiptNumber,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      items,
      subtotal,
      discount,
      tax,
      total,
      amountPaid: actualAmountPaid,
      change: actualChange,
      paymentMethod,
      referenceNumber: referenceNumber || undefined,
      bank: selectedBank || undefined,
      hmoProviderId: hmoVerification?.providerId,
      hmoPreAuthCode: hmoVerification?.preAuthCode,
      hmoCoverage: hmoVerification ? total * 0.9 : undefined, // 90% coverage
      patientLiability: hmoVerification ? total * 0.1 : undefined, // 10% co-pay
      cashierId: 'usr-current', // Would come from auth context
      cashierName: 'Blessing Okafor', // Would come from auth context
      createdAt: new Date().toISOString(),
      receiptUrl: `${window.location.origin}/receipts/${receiptNumber}`,
    };

    setClearance(newClearance);
    setCurrentStep(3);
  };

  // Handle done
  const handleDone = () => {
    if (clearance) {
      onComplete(clearance);
    }
  };

  // Handle amount received change
  const handleAmountReceivedChange = useCallback((amount: number, changeAmount: number) => {
    setAmountReceived(amount);
    setChange(changeAmount);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 && 'COLLECT PAYMENT (Step 1 of 3)'}
            {currentStep === 2 && 'PAYMENT METHOD (Step 2 of 3)'}
            {currentStep === 3 && '✓ PAYMENT SUCCESSFUL'}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 pb-4">
          <StepIndicator step={1} currentStep={currentStep} />
          <StepIndicator step={2} currentStep={currentStep} />
          <StepIndicator step={3} currentStep={currentStep} />
        </div>

        {/* Step 1: Review Items */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <PaymentSummaryCard
              patient={patient}
              items={items}
              total={total}
              discount={discount}
              tax={tax}
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => setCurrentStep(2)}>
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={(method) => {
                setPaymentMethod(method);
                // Reset method-specific state
                setReferenceNumber('');
                setSelectedBank('');
                setHmoProviderId('');
                setPolicyNumber('');
                setHmoVerification(null);
              }}
            />

            <Separator />

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <ChangeCalculator
                totalDue={total}
                onAmountReceived={handleAmountReceivedChange}
              />
            )}

            {/* POS Payment */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Amount Due:</span>
                  <span className="text-lg font-bold">{formatCurrency(total)}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-ref">POS Reference Number</Label>
                  <Input
                    id="pos-ref"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter POS transaction reference"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'transfer' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Amount Due:</span>
                  <span className="text-lg font-bold">{formatCurrency(total)}</span>
                </div>
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-ref">Transfer Reference</Label>
                  <Input
                    id="transfer-ref"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter transfer reference"
                  />
                </div>
              </div>
            )}

            {/* HMO Payment */}
            {paymentMethod === 'hmo' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>HMO Provider</Label>
                  <HMOProviderSelector
                    selected={hmoProviderId}
                    onChange={(id) => {
                      setHmoProviderId(id);
                      setHmoVerification(null);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy-num">Policy Number</Label>
                  <Input
                    id="policy-num"
                    value={policyNumber}
                    onChange={(e) => {
                      setPolicyNumber(e.target.value.toUpperCase());
                      setHmoVerification(null);
                    }}
                    placeholder="e.g. NHIA-12345-6789"
                  />
                </div>

                {!hmoVerification && (
                  <Button
                    onClick={handleVerifyHMO}
                    disabled={!hmoProviderId || !policyNumber || isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify HMO'}
                  </Button>
                )}

                {hmoVerification && (
                  <HMOVerificationCard verification={hmoVerification} />
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleProcessPayment}
                disabled={!isStep2Valid()}
              >
                Process Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && clearance && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-700">Payment Successful!</p>
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">{clearance.receiptNumber}</p>
              <p className="text-lg">{formatCurrency(clearance.total)}</p>
              <p className="text-muted-foreground">
                {paymentMethod === 'cash' && clearance.change > 0 && (
                  <span>Change: {formatCurrency(clearance.change)}</span>
                )}
              </p>
            </div>

            <ThermalReceipt clearance={clearance} patient={patient} />

            <div className="flex gap-2 justify-center">
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button onClick={handleDone}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
