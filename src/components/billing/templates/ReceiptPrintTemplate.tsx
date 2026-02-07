// ReceiptPrintTemplate - A5-sized print-friendly receipt

import { PaymentClearance } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { cn } from '@/lib/utils';

interface ReceiptPrintTemplateProps {
  clearance: PaymentClearance;
  patient: Patient;
  clinicInfo?: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const defaultClinicInfo = {
  name: 'LIFECARE MEDICAL CENTRE',
  address: '123 Herbert Macaulay Way, Yaba, Lagos State, Nigeria',
  phone: '+234 801 234 5678',
  email: 'info@lifecaremedical.ng',
};

export function ReceiptPrintTemplate({
  clearance,
  patient,
  clinicInfo = defaultClinicInfo,
}: ReceiptPrintTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: A5;
              margin: 10mm;
            }
            body * {
              visibility: hidden;
            }
            .print-receipt, .print-receipt * {
              visibility: visible;
            }
            .print-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 148mm;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        className={cn(
          'print-receipt mx-auto bg-background border rounded-lg p-6',
          'max-w-[148mm] font-mono text-sm'
        )}
      >
        {/* PAID Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 print:opacity-10"
          style={{ transform: 'rotate(-30deg)' }}
        >
          <span className="text-8xl font-bold text-foreground">PAID</span>
        </div>

        {/* Header */}
        <div className="text-center mb-4 relative">
          <div className="h-12 w-12 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
            LC
          </div>
          <h1 className="text-lg font-bold">{clinicInfo.name}</h1>
          <p className="text-xs text-muted-foreground">{clinicInfo.address}</p>
          <p className="text-xs text-muted-foreground">Tel: {clinicInfo.phone}</p>
        </div>

        <div className="border-t border-dashed pt-3 mb-3">
          <h2 className="text-center font-bold text-lg">RECEIPT</h2>
        </div>

        {/* Receipt Info */}
        <div className="space-y-1 text-xs mb-3">
          <div className="flex justify-between">
            <span>Receipt #:</span>
            <span className="font-bold">{clearance.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formatDateTime(clearance.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{clearance.cashierName}</span>
          </div>
        </div>

        <div className="border-t border-dashed pt-3 mb-3">
          <p className="font-bold text-xs mb-1">PATIENT INFORMATION</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{patient.firstName} {patient.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span>Patient #:</span>
              <span>{patient.mrn}</span>
            </div>
            {patient.phone && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{patient.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="border-t border-dashed pt-3 mb-3">
          <p className="font-bold text-xs mb-2">SERVICES</p>
          <div className="space-y-1">
            {clearance.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="flex-1 truncate">{item.description}</span>
                <span className="ml-2">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-dashed pt-3 mb-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(clearance.subtotal)}</span>
          </div>
          {clearance.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(clearance.discount)}</span>
            </div>
          )}
          {clearance.tax > 0 && (
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>{formatCurrency(clearance.tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>TOTAL:</span>
            <span>{formatCurrency(clearance.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid ({clearance.paymentMethod}):</span>
            <span>{formatCurrency(clearance.amountPaid)}</span>
          </div>
          {clearance.change > 0 && (
            <div className="flex justify-between">
              <span>Change:</span>
              <span>{formatCurrency(clearance.change)}</span>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="border-t border-dashed pt-3 mb-3 text-xs">
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="uppercase font-bold">{clearance.paymentMethod}</span>
          </div>
          {clearance.referenceNumber && (
            <div className="flex justify-between">
              <span>Reference:</span>
              <span>{clearance.referenceNumber}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-green-600 mt-2">
            <span>Status:</span>
            <span>PAID</span>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center my-4">
          <div className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
            QR Code
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p className="font-medium">Thank you for choosing {clinicInfo.name.split(' ')[0]}!</p>
          <p className="mt-2 text-[10px]">Computer-generated receipt - Valid without signature</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print flex justify-center mt-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Print Receipt
        </button>
      </div>
    </>
  );
}
