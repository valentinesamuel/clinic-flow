import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillsTable } from "@/components/billing/organisms/tables/BillsTable";
import { PaymentCollectionForm } from "@/components/billing/organisms/cashier-station/PaymentCollectionForm";
import { BillDetailsDrawer } from "@/components/billing/organisms/bill-details/BillDetailsDrawer";
import { BillCreationForm } from "@/components/billing/organisms/bill-creation/BillCreationForm";
import { ClaimCreationModal } from "@/components/billing/organisms/claim-submission/ClaimCreationModal";
import { QueuePagination } from "@/components/molecules/queue/QueuePagination";
import {
  Bill,
  BillStatus,
  BillingDepartment,
  PaymentItem,
  PaymentClearance,
  HMOClaim,
} from "@/types/billing.types";
import { Patient } from "@/types/patient.types";
import {
  getBillsPaginated,
  getBillsByDepartment,
  getPendingBillsByDepartment,
} from "@/data/bills";
import { usePatients } from "@/hooks/queries/usePatientQueries";
import {
  Search,
  Receipt,
  ArrowLeft,
  Plus,
  Building2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserBillingDepartment,
  getDepartmentLabel,
} from "@/utils/billingDepartment";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BillsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch patients data
  const { data: patientsData } = usePatients();
  const patients = patientsData?.data || [];

  // Determine default department based on user
  const userDepartment = user ? getUserBillingDepartment(user) : "all";
  const canViewAllDepartments = userDepartment === "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "all">(
    (searchParams.get("status") as BillStatus) || "all",
  );
  const [departmentFilter, setDepartmentFilter] = useState<BillingDepartment>(
    canViewAllDepartments ? "all" : userDepartment,
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
  const {
    data: bills,
    total,
    totalPages,
  } = getBillsPaginated(currentPage, pageSize, {
    department: departmentFilter,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  // Stats scoped by department filter
  const deptBills = getBillsByDepartment(departmentFilter);
  const pendingBills = getPendingBillsByDepartment(departmentFilter);
  const totalPending = pendingBills.reduce((sum, b) => sum + b.balance, 0);
  const totalPaidAmount = deptBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amountPaid, 0);
  const isCashier = user?.role === 'cashier';

  const handleCollect = (bill: Bill) => {
    const patient = patients.find((p) => p.id === bill.patientId);
    if (!patient) {
      toast({
        title: "Error",
        description: "Patient not found",
        variant: "destructive",
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
    const patient = patients.find(p => p.id === bill.patientId) || null;
    setDetailsBill(bill);
    setDetailsPatient(patient);
    setShowBillDetails(true);
  };

  const handleRowClick = (bill: Bill) => {
    handleView(bill);
  };

  const handlePrint = (bill: Bill) => {
    toast({
      title: "Print",
      description: `Printing ${bill.billNumber}`,
    });
  };

  const handlePaymentComplete = (clearance: PaymentClearance) => {
    toast({
      title: "Payment Successful",
      description: `Receipt ${clearance.receiptNumber} generated`,
    });
    setShowPaymentModal(false);
    setSelectedBill(null);
    setSelectedPatient(null);
    setSelectedItems([]);
  };

  const handleBillCreated = (bill: Partial<Bill>) => {
    toast({
      title: "Bill Created",
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
      title: "Claim Submitted",
      description: `Claim for ${claim.patientName} has been submitted`,
    });
    setShowClaimCreation(false);
    setClaimBill(null);
  };

  const handleClaimDraft = (claim: Partial<HMOClaim>) => {
    toast({
      title: "Draft Saved",
      description: `Claim draft for ${claim.patientName} has been saved`,
    });
    setShowClaimCreation(false);
    setClaimBill(null);
  };

  return (
    <DashboardLayout allowedRoles={["cashier", "hospital_admin", "cmo"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bills</h1>
              <p className="text-muted-foreground">
                Manage patient bills and payments
              </p>
            </div>
          </div>
          <Button onClick={() => setShowBillCreation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>

        {/* Stats */}
        <div className={`grid gap-5 ${isCashier ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-green-100 dark:bg-green-900/20`}
                >
                  <DollarSign className={`h-4 w-4 text-green-600`} />
                </div>
                <CardDescription>Total Pending Amount</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {formatCurrency(totalPending)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-amber-100 dark:bg-amber-900/20`}
                >
                  <Receipt className={`h-4 w-4 text-amber-600`} />
                </div>
                <CardDescription>Pending Bills</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {pendingBills.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-amber-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Awaiting payment</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-blue-100 dark:bg-blue-900/20`}
                >
                  <DollarSign className={`h-4 w-4 text-blue-600`} />
                </div>
                <CardDescription>Total Bills</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {deptBills.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          {isCashier && (
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex p-1.5 rounded-md w-fit bg-green-100 dark:bg-green-900/20`}
                  >
                    <DollarSign className={`h-4 w-4 text-green-600`} />
                  </div>
                  <CardDescription>Total Paid Amount</CardDescription>
                </div>
                <CardTitle className="text-xl font-bold ">
                  {formatCurrency(totalPaidAmount)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Collected</span>
                </div>
              </CardContent>
            </Card>
          )}
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
                    setStatusFilter(value as BillStatus | "all");
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
        preselectedPatient={
          claimBill ? patients.find(p => p.id === claimBill.patientId) || null : null
        }
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
