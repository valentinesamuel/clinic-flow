// Lab Billing Page - Department-filtered billing view

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BillDetailsDrawer } from '@/components/billing/organisms/bill-details/BillDetailsDrawer';
import { BillCreationForm } from '@/components/billing/organisms/bill-creation/BillCreationForm';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { Bill, BillStatus } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { useBills } from '@/hooks/queries/useBillQueries';
import { usePatient } from '@/hooks/queries/usePatientQueries';
import { Search, Receipt, ArrowLeft, Plus, TestTube, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBillingCode } from '@/utils/billingDepartment';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LabBillingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Bill details drawer state
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [detailsBill, setDetailsBill] = useState<Bill | null>(null);
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);

  // Bill creation modal state
  const [showBillCreation, setShowBillCreation] = useState(false);

  // Fetch bills with department filter
  const { data: allBills = [] } = useBills({
    department: 'lab',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });
  const total = allBills.length;
  const totalPages = Math.ceil(total / pageSize);
  const bills = allBills.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Stats for lab
  const { data: pendingLabBills = [] } = useBills({ department: 'lab', status: 'pending' });
  const totalPending = pendingLabBills.reduce((sum: number, b: any) => sum + b.balance, 0);

  const handleView = (bill: Bill) => {
    setDetailsBill(bill);
    setDetailsPatient(null);
    setShowBillDetails(true);
  };

  const handleRowClick = (bill: Bill) => {
    handleView(bill);
  };

  const handlePrint = (bill: Bill) => {
    toast({
      title: 'Print',
      description: `Printing ${bill.billNumber}`,
    });
  };

  const handleGenerateCode = (bill: Bill) => {
    const code = generateBillingCode();
    toast({
      title: 'Billing Code Generated',
      description: (
        <div className="mt-2">
          <p className="text-lg font-mono font-bold">{code}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Give this code to the patient to pay at the billing desk.
          </p>
        </div>
      ),
    });
  };

  const handleBillCreated = (bill: Partial<Bill>) => {
    toast({
      title: 'Bill Created',
      description: `Bill for ${bill.patientName} has been created`,
    });
    setShowBillCreation(false);
  };

  return (
    <DashboardLayout allowedRoles={['lab_tech', 'cmo', 'hospital_admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lab-tech')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TestTube className="h-6 w-6 text-primary" />
                Laboratory Billing
              </h1>
              <p className="text-muted-foreground">Manage laboratory department bills</p>
            </div>
          </div>
          <Button onClick={() => setShowBillCreation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Amount</CardDescription>
              <CardTitle className="text-xl text-destructive">{formatCurrency(totalPending)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Bills</CardDescription>
              <CardTitle className="text-xl">{pendingLabBills.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Bills</CardDescription>
              <CardTitle className="text-xl">{total}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <QrCode className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Billing Code System</p>
                <p className="text-xs text-muted-foreground">
                  Generate a billing code for patients to pay at the central billing desk. 
                  Codes expire after 3 days. Tests should only be processed after payment confirmation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Lab Bills
              </CardTitle>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bills or codes..."
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BillsTable
              bills={bills}
              onView={handleView}
              onPrint={handlePrint}
              onRowClick={handleRowClick}
              showGenerateCode
              onGenerateCode={handleGenerateCode}
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

      {/* Bill Details Drawer */}
      <BillDetailsDrawer
        open={showBillDetails}
        onOpenChange={setShowBillDetails}
        bill={detailsBill}
        patient={detailsPatient}
        onPrint={() => {
          if (detailsBill) handlePrint(detailsBill);
        }}
      />

      {/* Bill Creation Modal */}
      <BillCreationForm
        open={showBillCreation}
        onOpenChange={setShowBillCreation}
        onComplete={handleBillCreated}
        onCancel={() => setShowBillCreation(false)}
      />
    </DashboardLayout>
  );
}
