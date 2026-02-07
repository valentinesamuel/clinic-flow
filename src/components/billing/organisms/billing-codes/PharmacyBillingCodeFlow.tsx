// PharmacyBillingCodeFlow - Generate billing code for pharmacy/lab payments

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaymentItem } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { BillingDepartment } from '@/types/billing.types';
import { generateBillingCode, getBillingCodeExpiry } from '@/utils/billingDepartment';
import { Copy, Printer, CheckCircle2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PharmacyBillingCodeFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  items: PaymentItem[];
  department: BillingDepartment;
  prescriptionId?: string;
  onComplete: (code: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function PharmacyBillingCodeFlow({
  open,
  onOpenChange,
  patient,
  items,
  department,
  prescriptionId,
  onComplete,
}: PharmacyBillingCodeFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const isHmoPatient = patient.paymentType === 'hmo';
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const hmoCoverage = isHmoPatient ? subtotal * 0.9 : 0;
  const expiryDateStr = getBillingCodeExpiry();
  const expiryDateObj = new Date(expiryDateStr);
  const patientLiability = isHmoPatient ? subtotal * 0.1 : subtotal;

  

  const handleGenerateCode = () => {
    const code = generateBillingCode();
    setGeneratedCode(code);
    setStep(2);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({
        title: 'Code Copied',
        description: 'Billing code copied to clipboard',
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=500');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Billing Code - ${generatedCode}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              text-align: center;
              padding: 20px;
            }
            .code {
              font-size: 48px;
              font-weight: bold;
              letter-spacing: 4px;
              margin: 30px 0;
              padding: 20px;
              border: 3px dashed #333;
            }
            .info {
              font-size: 14px;
              margin: 10px 0;
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .instructions {
              font-size: 12px;
              margin-top: 30px;
              padding: 15px;
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <h2>LIFECARE MEDICAL CENTRE</h2>
          <p class="info">${department === 'pharmacy' ? 'Pharmacy' : 'Laboratory'} Billing Code</p>
          <div class="code">${generatedCode}</div>
          <p class="info">Patient: ${patient.firstName} ${patient.lastName}</p>
          <p class="info">MRN: ${patient.mrn}</p>
          <p class="amount">Amount Due: ₦${patientLiability.toLocaleString()}</p>
          <p class="info">Expires: ${expiryDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <div class="instructions">
            <p><strong>Instructions:</strong></p>
            <p>Take this code to the billing desk to make payment.</p>
            <p>Payment must be made before services can be rendered.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleClose = () => {
    if (generatedCode) {
      onComplete(generatedCode);
    }
    setStep(1);
    setGeneratedCode(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Generate Billing Code' : '✓ Billing Code Generated'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{patient.mrn}</p>
            </div>

            {prescriptionId && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Prescription</p>
                <p className="font-mono text-sm">{prescriptionId}</p>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Items</p>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-1"
                >
                  <span>
                    {item.description}
                    {item.quantity > 1 && ` × ${item.quantity}`}
                  </span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {isHmoPatient && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>HMO Coverage (90%)</span>
                    <span>-{formatCurrency(hmoCoverage)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Patient Co-pay (10%)</span>
                    <span>{formatCurrency(patientLiability)}</span>
                  </div>
                </>
              )}

              {!isHmoPatient && (
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              )}
            </div>

            {isHmoPatient && (
              <Badge variant="secondary" className="w-full justify-center">
                HMO: {patient.hmoDetails?.providerName}
              </Badge>
            )}
          </div>
        )}

        {step === 2 && generatedCode && (
          <div className="space-y-6 text-center">
            <div className="py-4">
              <div
                className={cn(
                  'inline-flex items-center justify-center',
                  'text-4xl font-mono font-bold tracking-widest',
                  'px-8 py-4 rounded-lg border-2 border-dashed border-primary bg-primary/5'
                )}
              >
                {generatedCode}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Direct patient to the billing desk with this code
              </p>
              <p className="text-lg font-bold">
                Amount Due: {formatCurrency(patientLiability)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {expiryDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerateCode}>
                <QrCode className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
            </>
          )}
          {step === 2 && (
            <Button onClick={handleClose} className="w-full">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
