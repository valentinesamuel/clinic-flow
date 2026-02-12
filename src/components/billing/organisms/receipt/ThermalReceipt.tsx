import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PaymentClearance, PaymentMethod } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { ReceiptHeader } from '@/components/billing/molecules/receipt/ReceiptHeader';
import { ReceiptItemList } from '@/components/billing/molecules/receipt/ReceiptItemList';
import { ReceiptTotals } from '@/components/billing/molecules/receipt/ReceiptTotals';
import { ReceiptFooter } from '@/components/billing/molecules/receipt/ReceiptFooter';
import { Separator } from '@/components/ui/separator';

interface ThermalReceiptProps {
  clearance: PaymentClearance;
  patient: Patient;
  onPrint?: () => void;
}

export function ThermalReceipt({ clearance, patient, onPrint }: ThermalReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Create a print window for thermal receipt
    const printWindow = window.open('', '_blank', 'width=302,height=600');
    if (!printWindow) return;

    const receiptHTML = receiptRef.current?.innerHTML || '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${clearance.receiptNumber}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              width: 80mm;
              margin: 0;
              padding: 8px;
              font-size: 12px;
              line-height: 1.4;
            }
            .receipt-content {
              width: 100%;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="receipt-content">${receiptHTML}</div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    onPrint?.();
  };

  const formattedDate = new Date(clearance.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-4">
      {/* Thermal Receipt Preview */}
      <div
        ref={receiptRef}
        className="bg-background border rounded-lg p-4 max-w-[302px] mx-auto shadow-sm"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Patient Info */}
        <div className="text-xs mb-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Patient:</span>
            <span className="font-medium">{patient.firstName} {patient.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">MRN:</span>
            <span className="font-medium">{patient.mrn}</span>
          </div>
        </div>

        <Separator />

        <ReceiptHeader
          receiptNumber={clearance.receiptNumber}
          date={formattedDate}
          cashier={clearance.cashierName}
        />

        <ReceiptItemList items={clearance.items} />

        <ReceiptTotals
          subtotal={clearance.subtotal}
          discount={clearance.discount}
          tax={clearance.tax}
          total={clearance.total}
          amountPaid={clearance.amountPaid}
          change={clearance.change}
          paymentMethod={clearance.paymentMethod}
        />

        {/* Split Payment Methods */}
        {clearance.paymentSplits && clearance.paymentSplits.length > 1 && (
          <div className="my-2">
            <Separator />
            <p className="text-xs font-medium my-1 text-center">PAYMENT METHODS</p>
            <div className="space-y-0.5 text-xs">
              {clearance.paymentSplits.map((split) => {
                const methodLabels: Record<PaymentMethod, string> = {
                  cash: 'Cash',
                  card: 'POS/Card',
                  transfer: 'Transfer',
                  hmo: 'HMO',
                  corporate: 'Corporate',
                };
                return (
                  <div key={split.id} className="flex justify-between">
                    <span>{methodLabels[split.method]}</span>
                    <span>
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(split.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ReceiptFooter
          paymentMethod={clearance.paymentMethod}
          showQRCode={true}
          receiptId={clearance.id}
        />
      </div>

      {/* Print Button */}
      <div className="flex justify-center no-print">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
}
