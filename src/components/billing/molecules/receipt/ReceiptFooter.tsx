import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '@/types/billing.types';
import { QrCode } from 'lucide-react';

interface ReceiptFooterProps {
  showQRCode?: boolean;
  receiptId?: string;
  paymentMethod: PaymentMethod;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'POS',
  transfer: 'Bank Transfer',
  hmo: 'HMO',
  corporate: 'Corporate',
};

export function ReceiptFooter({ showQRCode = false, receiptId, paymentMethod }: ReceiptFooterProps) {
  const receiptUrl = receiptId ? `${window.location.origin}/receipts/${receiptId}` : undefined;

  return (
    <div className="font-mono text-center space-y-3 mt-4">
      <Separator />

      {/* Payment Method & Status */}
      <div className="text-xs space-y-1">
        <div className="flex justify-center gap-2">
          <span className="text-muted-foreground">Payment Method:</span>
          <span className="font-medium">{PAYMENT_METHOD_LABELS[paymentMethod]}</span>
        </div>
        <div className="flex justify-center gap-2">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-bold text-green-600">PAID</span>
        </div>
      </div>

      {/* QR Code Placeholder */}
      {showQRCode && receiptUrl && (
        <div className="flex flex-col items-center gap-1">
          <div className="h-24 w-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/20">
            <QrCode className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <p className="text-[10px] text-muted-foreground break-all max-w-full px-2">
            {receiptUrl}
          </p>
        </div>
      )}

      {/* Thank You Message */}
      <div className="space-y-1">
        <p className="text-sm font-medium">Thank you for choosing</p>
        <p className="text-sm font-bold">LifeCare!</p>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground">
        This is a computer-generated receipt
      </p>
    </div>
  );
}
