// TransactionHistory - Full transaction history table with filters

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShiftTransaction } from '@/types/cashier.types';
import { Search, Download, Receipt } from 'lucide-react';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { cn } from '@/lib/utils';

interface TransactionHistoryProps {
  transactions: ShiftTransaction[];
  onViewReceipt?: (receiptNumber: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TransactionHistory({
  transactions,
  onViewReceipt,
}: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Filter transactions
  let filtered = [...transactions];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.receiptNumber.toLowerCase().includes(query) ||
        t.patientName.toLowerCase().includes(query) ||
        t.patientMrn.toLowerCase().includes(query)
    );
  }

  if (methodFilter !== 'all') {
    filtered = filtered.filter((t) => t.paymentMethod === methodFilter);
  }

  // Sort by timestamp descending
  filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const handleExport = () => {
    // Generate CSV
    const headers = ['Receipt #', 'Patient', 'MRN', 'Amount', 'Method', 'Time'];
    const rows = filtered.map((t) => [
      t.receiptNumber,
      t.patientName,
      t.patientMrn,
      t.amount.toString(),
      t.paymentMethod,
      new Date(t.timestamp).toISOString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 w-56"
              />
            </div>
            <Select
              value={methodFilter}
              onValueChange={(v) => {
                setMethodFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="hmo">HMO</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paginated.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No transactions found
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((txn) => (
                  <TableRow
                    key={txn.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewReceipt?.(txn.receiptNumber)}
                  >
                    <TableCell className="font-mono text-sm">
                      {txn.receiptNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{txn.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {txn.patientMrn}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          txn.paymentMethod === 'cash' &&
                            'border-green-500 text-green-600',
                          txn.paymentMethod === 'card' &&
                            'border-blue-500 text-blue-600',
                          txn.paymentMethod === 'transfer' &&
                            'border-purple-500 text-purple-600',
                          txn.paymentMethod === 'hmo' &&
                            'border-orange-500 text-orange-600'
                        )}
                      >
                        {txn.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {txn.billingCode && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {txn.billingCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTime(txn.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <QueuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={() => {}}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
