import { useState, useEffect } from 'react';
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
import { BillsTable } from '@/components/billing/organisms/tables/BillsTable';
import { PaymentCollectionForm } from '@/components/billing/organisms/cashier-station/PaymentCollectionForm';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { Bill, BillStatus, PaymentItem, PaymentClearance } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { getBillsPaginated, getPendingBills, getTotalPendingAmount } from '@/data/bills';
import { mockPatients } from '@/data/patients';
import { Search, Receipt, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BillsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>(
    (searchParams.get('status') as BillStatus) || 'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);

  // Fetch bills with filters
  const { data: bills, total, totalPages } = getBillsPaginated(currentPage, pageSize, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  // Stats
  const pendingBills = getPendingBills();
  const totalPending = getTotalPendingAmount();
  const awaitingPayment = pendingBills.length;

  const handleCollect = (bill: Bill) => {
    const patient = mockPatients.find((p) => p.id === bill.patientId);
    if (!patient) {
      toast({
        title: 'Error',
        description: 'Patient not found',
        variant: 'destructive',
      });
      return;
    }

    const items: PaymentItem[] = bill.items.map((item) => ({
      id: item.id,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total,
    }));

    setSelectedBill(bill);
    setSelectedPatient(patient);
    setSelectedItems(items);
    setShowPaymentModal(true);
  };

  const handleView = (bill: Bill) => {
    toast({
      title: 'Bill Details',
      description: `Viewing ${bill.billNumber}`,
    });
  };

  const handlePrint = (bill: Bill) => {
    toast({
      title: 'Print',
      description: `Printing ${bill.billNumber}`,
    });
  };

  const handlePaymentComplete = (clearance: PaymentClearance) => {
    toast({
      title: 'Payment Successful',
      description: `Receipt ${clearance.receiptNumber} generated`,
    });
    setShowPaymentModal(false);
    setSelectedBill(null);
    setSelectedPatient(null);
    setSelectedItems([]);
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
              <h1 className="text-2xl font-bold text-foreground">Bills</h1>
              <p className="text-muted-foreground">Manage patient bills and payments</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pending</CardDescription>
              <CardTitle className="text-xl text-destructive">{formatCurrency(totalPending)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bills Today</CardDescription>
              <CardTitle className="text-xl">{bills.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Awaiting Payment</CardDescription>
              <CardTitle className="text-xl">{awaitingPayment}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                All Bills
              </CardTitle>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bills..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-64"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value as BillStatus | 'all');
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="waived">Waived</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BillsTable
              bills={bills}
              onCollect={handleCollect}
              onView={handleView}
              onPrint={handlePrint}
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

      {/* Payment Modal */}
      {selectedPatient && (
        <PaymentCollectionForm
          open={showPaymentModal}
          patient={selectedPatient}
          items={selectedItems}
          onComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
            setSelectedPatient(null);
            setSelectedItems([]);
          }}
        />
      )}
    </DashboardLayout>
  );
}
