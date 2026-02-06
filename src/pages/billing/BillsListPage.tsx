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
import { BillDetailsDrawer } from '@/components/billing/organisms/bill-details/BillDetailsDrawer';
import { BillCreationForm } from '@/components/billing/organisms/bill-creation/BillCreationForm';
import { ClaimCreationModal } from '@/components/billing/organisms/claim-submission/ClaimCreationModal';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { Bill, BillStatus, BillingDepartment, PaymentItem, PaymentClearance, HMOClaim } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { getBillsPaginated, getPendingBills, getTotalPendingAmount } from '@/data/bills';
import { mockPatients, getPatientById } from '@/data/patients';
import { Search, Receipt, ArrowLeft, Plus, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getDepartmentForRole, getDepartmentLabel } from '@/utils/billingDepartment';

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
  const { user } = useAuth();

  // Determine default department based on user role
  const userDepartment = user ? getDepartmentForRole(user.role) : 'all';
  const canViewAllDepartments = userDepartment === 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>(
    (searchParams.get('status') as BillStatus) || 'all'
  );
  const [departmentFilter, setDepartmentFilter] = useState<BillingDepartment>(
    canViewAllDepartments ? 'all' : userDepartment
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);

  // Bill details drawer state
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [detailsBill, setDetailsBill] = useState<Bill | null>(null);
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);

  // Bill creation modal state
  const [showBillCreation, setShowBillCreation] = useState(false);

  // Claim creation modal state
  const [showClaimCreation, setShowClaimCreation] = useState(false);
  const [claimBill, setClaimBill] = useState<Bill | null>(null);

  // Fetch bills with filters
  const { data: bills, total, totalPages } = getBillsPaginated(currentPage, pageSize, {
    department: departmentFilter,
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
    const patient = getPatientById(bill.patientId) || null;
    setDetailsBill(bill);
    setDetailsPatient(patient);
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

  const handleBillCreated = (bill: Partial<Bill>) => {
    toast({
      title: 'Bill Created',
      description: `Bill for ${bill.patientName} has been created`,
    });
    setShowBillCreation(false);
  };

  const handleCreateClaimFromBill = () => {
    if (detailsBill) {
      setClaimBill(detailsBill);
      setShowBillDetails(false);
      setShowClaimCreation(true);
    }
  };

  const handleClaimComplete = (claim: Partial<HMOClaim>) => {
    toast({
      title: 'Claim Submitted',
      description: `Claim for ${claim.patientName} has been submitted`,
    });
    setShowClaimCreation(false);
    setClaimBill(null);
  };

  const handleClaimDraft = (claim: Partial<HMOClaim>) => {
    toast({
      title: 'Draft Saved',
      description: `Claim draft for ${claim.patientName} has been saved`,
    });
    setShowClaimCreation(false);
    setClaimBill(null);
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
          <Button onClick={() => setShowBillCreation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
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
                {canViewAllDepartments && (
                  <Select
                    value={departmentFilter}
                    onValueChange={(value) => {
                      setDepartmentFilter(value as BillingDepartment);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <Building2 className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="front_desk">Front Desk</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="nursing">Nursing</SelectItem>
                      <SelectItem value="inpatient">Inpatient</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BillsTable
              bills={bills}
              onCollect={handleCollect}
              onView={handleView}
              onPrint={handlePrint}
              onRowClick={handleRowClick}
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
        onCollect={() => {
          if (detailsBill) {
            setShowBillDetails(false);
            handleCollect(detailsBill);
          }
        }}
        onCreateClaim={handleCreateClaimFromBill}
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

      {/* Claim Creation Modal */}
      <ClaimCreationModal
        open={showClaimCreation}
        onOpenChange={setShowClaimCreation}
        preselectedBill={claimBill}
        preselectedPatient={claimBill ? getPatientById(claimBill.patientId) : null}
        onComplete={handleClaimComplete}
        onSaveDraft={handleClaimDraft}
        onCancel={() => {
          setShowClaimCreation(false);
          setClaimBill(null);
        }}
      />

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
