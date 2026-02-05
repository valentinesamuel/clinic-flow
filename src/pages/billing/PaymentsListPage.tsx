import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaymentsTable } from '@/components/billing/organisms/tables/PaymentsTable';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { PaymentMethod } from '@/types/billing.types';
import { PaymentRecord, getPaymentsPaginated, getDailyRevenue } from '@/data/payments';
import { Search, CreditCard, ArrowLeft, Download, Banknote, Building2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PaymentsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialMethod = searchParams.get('method') as PaymentMethod | null;
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>(initialMethod || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Fetch payments with filters
  const { data: payments, total, totalPages } = getPaymentsPaginated(currentPage, pageSize, {
    method: methodFilter !== 'all' ? methodFilter : undefined,
    search: searchQuery || undefined,
  });

  // Today's revenue
  const dailyRevenue = getDailyRevenue();

  const handleViewReceipt = (payment: PaymentRecord) => {
    toast({
      title: 'View Receipt',
      description: `Viewing ${payment.receiptNumber}`,
    });
  };

  const handleReprint = (payment: PaymentRecord) => {
    toast({
      title: 'Reprint',
      description: `Reprinting ${payment.receiptNumber}`,
    });
  };

  const handleEmail = (payment: PaymentRecord) => {
    toast({
      title: 'Email Sent',
      description: `Receipt emailed for ${payment.receiptNumber}`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export',
      description: 'Exporting transactions to CSV...',
    });
  };

  return (
    <DashboardLayout allowedRoles={['billing', 'hospital_admin', 'cmo']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/billing')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payments & Transactions</h1>
              <p className="text-muted-foreground">Payment history and receipts</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Revenue Summary */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Banknote className="h-4 w-4" />
                Cash
              </CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.cash)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                POS
              </CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.card)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Transfer
              </CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.transfer)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                HMO
              </CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.hmo)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80">Today's Total</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.total)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-64"
                  />
                </div>
                <Select
                  value={methodFilter}
                  onValueChange={(value) => {
                    setMethodFilter(value as PaymentMethod | 'all');
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">POS</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="hmo">HMO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PaymentsTable
              payments={payments}
              onViewReceipt={handleViewReceipt}
              onReprint={handleReprint}
              onEmail={handleEmail}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <QueuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
