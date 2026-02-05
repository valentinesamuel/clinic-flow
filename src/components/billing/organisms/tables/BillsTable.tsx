import { Bill } from '@/types/billing.types';
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
import { MoreHorizontal, CreditCard, Eye, Printer, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface BillsTableProps {
  bills: Bill[];
  onCollect: (bill: Bill) => void;
  onView: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusBadge(status: Bill['status']) {
  const variants: Record<Bill['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'destructive', label: 'Pending' },
    partial: { variant: 'secondary', label: 'Partial' },
    paid: { variant: 'default', label: 'Paid' },
    waived: { variant: 'outline', label: 'Waived' },
    refunded: { variant: 'outline', label: 'Refunded' },
  };

  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function BillsTable({ bills, onCollect, onView, onPrint }: BillsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No bills found.
              </TableCell>
            </TableRow>
          ) : (
            bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">
                  <button
                    onClick={() => onView(bill)}
                    className="text-primary hover:underline"
                  >
                    {bill.billNumber}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{bill.patientName}</p>
                    <p className="text-sm text-muted-foreground">{bill.patientMrn}</p>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(bill.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{bill.items.length} items</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(bill.total)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(bill.amountPaid)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={bill.balance > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                    {formatCurrency(bill.balance)}
                  </span>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(bill.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {bill.status !== 'paid' && (
                        <DropdownMenuItem onClick={() => onCollect(bill)}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Collect Payment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onView(bill)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPrint(bill)}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
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
