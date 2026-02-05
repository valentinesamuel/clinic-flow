import { PaymentRecord } from '@/data/payments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Printer, Mail, Banknote, CreditCard, Building2, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentsTableProps {
  payments: PaymentRecord[];
  onViewReceipt: (payment: PaymentRecord) => void;
  onReprint: (payment: PaymentRecord) => void;
  onEmail: (payment: PaymentRecord) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getMethodIcon(method: PaymentRecord['paymentMethod']) {
  const icons = {
    cash: <Banknote className="h-4 w-4" />,
    card: <CreditCard className="h-4 w-4" />,
    transfer: <Building2 className="h-4 w-4" />,
    hmo: <Shield className="h-4 w-4" />,
    corporate: <Building2 className="h-4 w-4" />,
  };
  return icons[method];
}

function getMethodLabel(method: PaymentRecord['paymentMethod']) {
  const labels = {
    cash: 'Cash',
    card: 'POS',
    transfer: 'Transfer',
    hmo: 'HMO',
    corporate: 'Corporate',
  };
  return labels[method];
}

function getMethodBadgeClass(method: PaymentRecord['paymentMethod']) {
  const classes = {
    cash: 'bg-green-100 text-green-700',
    card: 'bg-blue-100 text-blue-700',
    transfer: 'bg-purple-100 text-purple-700',
    hmo: 'bg-orange-100 text-orange-700',
    corporate: 'bg-gray-100 text-gray-700',
  };
  return classes[method];
}

export function PaymentsTable({ payments, onViewReceipt, onReprint, onEmail }: PaymentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  <button
                    onClick={() => onViewReceipt(payment)}
                    className="text-primary hover:underline"
                  >
                    {payment.receiptNumber}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{payment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{payment.patientMrn}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{format(new Date(payment.createdAt), 'dd MMM yyyy')}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(payment.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  <Badge className={getMethodBadgeClass(payment.paymentMethod)}>
                    <span className="flex items-center gap-1">
                      {getMethodIcon(payment.paymentMethod)}
                      {getMethodLabel(payment.paymentMethod)}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.referenceNumber ? (
                    <span className="text-sm font-mono">{payment.referenceNumber}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{payment.cashierName}</p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewReceipt(payment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReprint(payment)}>
                        <Printer className="h-4 w-4 mr-2" />
                        Reprint
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEmail(payment)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email Receipt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
