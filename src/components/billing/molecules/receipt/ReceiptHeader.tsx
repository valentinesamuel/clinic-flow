import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';

interface ReceiptHeaderProps {
  receiptNumber: string;
  date: string;
  cashier?: string;
}

export function ReceiptHeader({ receiptNumber, date, cashier }: ReceiptHeaderProps) {
  return (
    <div className="text-center space-y-2 font-mono">
      {/* Clinic Logo/Icon */}
      <div className="flex justify-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Clinic Name */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">LIFECARE MEDICAL CENTRE</h2>
        <p className="text-xs text-muted-foreground">123 Herbert Macaulay Way</p>
        <p className="text-xs text-muted-foreground">Yaba, Lagos State, Nigeria</p>
        <p className="text-xs text-muted-foreground">Tel: +234 801 234 5678</p>
      </div>

      <Separator />

      {/* Receipt Title */}
      <h1 className="text-xl font-bold tracking-widest">RECEIPT</h1>

      <Separator />

      {/* Receipt Details */}
      <div className="text-xs space-y-0.5 text-left">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Receipt #:</span>
          <span className="font-medium">{receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{date}</span>
        </div>
        {cashier && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cashier:</span>
            <span className="font-medium">{cashier}</span>
          </div>
        )}
      </div>
    </div>
  );
}
