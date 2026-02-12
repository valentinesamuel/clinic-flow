import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClaimsTable } from "@/components/billing/organisms/tables/ClaimsTable";
import { ClaimDetailsDrawer } from "@/components/billing/organisms/claim-details/ClaimDetailsDrawer";
import { ClaimWithdrawalModal } from "@/components/billing/organisms/claim-details/ClaimWithdrawalModal";
import { PayOutOfPocketModal } from "@/components/billing/organisms/claim-details/PayOutOfPocketModal";
import { ClaimCreationModal } from "@/components/billing/organisms/claim-submission/ClaimCreationModal";
import { ClaimEditModal } from "@/components/billing/organisms/claim-submission/ClaimEditModal";
import { BillDetailsDrawer } from "@/components/billing/organisms/bill-details/BillDetailsDrawer";
import { QueuePagination } from "@/components/molecules/queue/QueuePagination";
import {
  HMOClaim,
  ClaimStatus,
  WithdrawalReason,
  PaymentMethod,
  Bill,
} from "@/types/billing.types";
import {
  getClaimsPaginated,
  mockHMOProviders,
  submitClaim,
  updateClaimStatus,
} from "@/data/claims";
import { getBillById } from "@/data/bills";
import { Search, FileCheck, ArrowLeft, Send, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBillingDepartment } from "@/utils/billingDepartment";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const statusTabs: { value: ClaimStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "paid", label: "Paid" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function ClaimsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const userDepartment = user ? getUserBillingDepartment(user) : 'all';

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "all">(
    (searchParams.get("status") as ClaimStatus) || "all",
  );
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Claim details drawer state
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [detailsClaim, setDetailsClaim] = useState<HMOClaim | null>(null);

  // Bill details drawer state
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [detailsBill, setDetailsBill] = useState<Bill | null>(null);

  // Claim creation modal state
  const [showClaimCreation, setShowClaimCreation] = useState(false);

  // Claim edit modal state
  const [showClaimEdit, setShowClaimEdit] = useState(false);
  const [editClaim, setEditClaim] = useState<HMOClaim | null>(null);
  const [editMode, setEditMode] = useState<"edit" | "resubmit">("edit");

  // Withdrawal modal state
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawClaim, setWithdrawClaim] = useState<HMOClaim | null>(null);

  // Pay out of pocket modal state
  const [showPayOutOfPocket, setShowPayOutOfPocket] = useState(false);
  const [payOutOfPocketClaim, setPayOutOfPocketClaim] =
    useState<HMOClaim | null>(null);

  // Fetch claims with filters
  const {
    data: allClaims,
    total: rawTotal,
    totalPages: rawTotalPages,
  } = getClaimsPaginated(currentPage, pageSize, {
    status: statusFilter !== "all" ? statusFilter : undefined,
    providerId: providerFilter !== "all" ? providerFilter : undefined,
    search: searchQuery || undefined,
  });

  // Filter claims by department for cashier role
  const claims = userDepartment === 'all'
    ? allClaims
    : allClaims.filter((claim) => {
        const bill = getBillById(claim.billId);
        return bill ? bill.department === userDepartment : true;
      });
  const total = userDepartment === 'all' ? rawTotal : claims.length;
  const totalPages = userDepartment === 'all' ? rawTotalPages : Math.max(1, Math.ceil(claims.length / pageSize));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(claims.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleSubmit = (claim: HMOClaim) => {
    submitClaim(claim.id);
    toast({
      title: "Claim Submitted",
      description: `${claim.claimNumber} has been submitted`,
    });
  };

  const handleView = (claim: HMOClaim) => {
    // Navigate to claim detail page based on user role
    const roleBasePath = user?.role === 'hospital_admin' ? '/hospital-admin/billing' : user?.role === 'cmo' ? '/cmo/billing' : '/cashier';
    navigate(`${roleBasePath}/claims/${claim.id}`);
  };

  const handleRowClick = (claim: HMOClaim) => {
    handleView(claim);
  };

  const handleEdit = (claim: HMOClaim) => {
    setEditClaim(claim);
    setEditMode("edit");
    setShowClaimEdit(true);
  };

  const handleResubmit = (claim: HMOClaim) => {
    setEditClaim(claim);
    setEditMode("resubmit");
    setShowClaimEdit(true);
  };

  const handleMarkPaid = (claim: HMOClaim) => {
    updateClaimStatus(claim.id, "paid");
    toast({
      title: "Claim Marked as Paid",
      description: `${claim.claimNumber} has been marked as paid`,
    });
  };

  const handleBatchSubmit = () => {
    const draftClaims = claims.filter(
      (c) => selectedIds.includes(c.id) && c.status === "draft",
    );
    draftClaims.forEach((c) => submitClaim(c.id));
    toast({
      title: "Batch Submit",
      description: `${draftClaims.length} claims submitted`,
    });
    setSelectedIds([]);
  };

  const handleNewClaim = () => {
    setShowClaimCreation(true);
  };

  const handleClaimComplete = (claim: Partial<HMOClaim>) => {
    toast({
      title: "Claim Submitted",
      description: `Claim for ${claim.patientName} has been submitted`,
    });
    setShowClaimCreation(false);
  };

  const handleClaimDraft = (claim: Partial<HMOClaim>) => {
    toast({
      title: "Draft Saved",
      description: `Claim draft for ${claim.patientName} has been saved`,
    });
    setShowClaimCreation(false);
  };

  const handleEditSave = (claim: Partial<HMOClaim>) => {
    toast({
      title: "Draft Saved",
      description: `Claim ${editClaim?.claimNumber} has been updated`,
    });
    setShowClaimEdit(false);
    setEditClaim(null);
  };

  const handleEditSubmit = (claim: Partial<HMOClaim>) => {
    toast({
      title: editMode === "resubmit" ? "Claim Resubmitted" : "Claim Submitted",
      description: `${editClaim?.claimNumber} has been ${editMode === "resubmit" ? "resubmitted" : "submitted"}`,
    });
    setShowClaimEdit(false);
    setEditClaim(null);
  };

  // Actions from drawer
  const handleDrawerEdit = () => {
    if (detailsClaim) {
      setShowClaimDetails(false);
      handleEdit(detailsClaim);
    }
  };

  const handleDrawerSubmit = () => {
    if (detailsClaim) {
      handleSubmit(detailsClaim);
      setShowClaimDetails(false);
    }
  };

  const handleDrawerResubmit = () => {
    if (detailsClaim) {
      setShowClaimDetails(false);
      handleResubmit(detailsClaim);
    }
  };

  const handleDrawerMarkPaid = () => {
    if (detailsClaim) {
      handleMarkPaid(detailsClaim);
      setShowClaimDetails(false);
    }
  };

  const handleDrawerViewBill = (billId: string) => {
    const bill = getBillById(billId);
    if (bill) {
      setDetailsBill(bill);
      setShowBillDetails(true);
    }
  };

  const handleDrawerWithdraw = () => {
    if (detailsClaim) {
      setWithdrawClaim(detailsClaim);
      setShowWithdrawal(true);
    }
  };

  const handleDrawerPayOutOfPocket = () => {
    if (detailsClaim) {
      setPayOutOfPocketClaim(detailsClaim);
      setShowPayOutOfPocket(true);
    }
  };

  const handleWithdraw = (reason: WithdrawalReason, notes?: string) => {
    if (withdrawClaim) {
      updateClaimStatus(withdrawClaim.id, "withdrawn");
      toast({
        title: "Claim Withdrawn",
        description: `${withdrawClaim.claimNumber} has been withdrawn`,
      });
      setShowClaimDetails(false);
    }
  };

  const handleRequestRetraction = (reason: WithdrawalReason, notes: string) => {
    if (withdrawClaim) {
      updateClaimStatus(withdrawClaim.id, "retracted");
      toast({
        title: "Retraction Requested",
        description: `${withdrawClaim.claimNumber} retraction request submitted. Please contact the HMO to complete.`,
      });
      setShowClaimDetails(false);
    }
  };

  const handlePayOutOfPocketConfirm = (
    paymentMethod: PaymentMethod,
    referenceNumber?: string,
    bank?: string,
  ) => {
    if (payOutOfPocketClaim) {
      updateClaimStatus(payOutOfPocketClaim.id, "withdrawn");
      toast({
        title: "Converted to Private Pay",
        description: `${payOutOfPocketClaim.claimNumber} has been withdrawn. Payment collected via ${paymentMethod}.`,
      });
      setShowClaimDetails(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["cashier", "hospital_admin", "cmo"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">HMO Claims</h1>
              <p className="text-muted-foreground">
                Manage and track insurance claims
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button variant="outline" onClick={handleBatchSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit Selected ({selectedIds.length})
              </Button>
            )}
            <Button onClick={handleNewClaim}>
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Claims</CardDescription>
              <CardTitle className="text-xl text-amber-600">
                {
                  claims.filter((c) =>
                    ["draft", "submitted", "processing"].includes(c.status),
                  ).length
                }
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-xl text-green-600">
                {claims.filter((c) => c.status === "approved").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Denied</CardDescription>
              <CardTitle className="text-xl text-destructive">
                {claims.filter((c) => c.status === "denied").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paid (YTD)</CardDescription>
              <CardTitle className="text-xl text-primary">
                {claims.filter((c) => c.status === "paid").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Claims
              </CardTitle>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search claims..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-64"
                  />
                </div>
                <Select
                  value={providerFilter}
                  onValueChange={(value) => {
                    setProviderFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="HMO Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {mockHMOProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Status Tabs */}
            <Tabs
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as ClaimStatus | "all");
                setCurrentPage(1);
              }}
              className="mb-4"
            >
              <TabsList className="flex-wrap">
                {statusTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <ClaimsTable
              claims={claims}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onSubmit={handleSubmit}
              onView={handleView}
              onEdit={handleEdit}
              onResubmit={handleResubmit}
              onMarkPaid={handleMarkPaid}
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

      {/* Claim Details Drawer */}
      <ClaimDetailsDrawer
        open={showClaimDetails}
        onOpenChange={setShowClaimDetails}
        claim={detailsClaim}
        onEdit={handleDrawerEdit}
        onSubmit={handleDrawerSubmit}
        onResubmit={handleDrawerResubmit}
        onMarkPaid={handleDrawerMarkPaid}
        onViewBill={handleDrawerViewBill}
        onWithdraw={handleDrawerWithdraw}
        onPayOutOfPocket={handleDrawerPayOutOfPocket}
      />

      {/* Bill Details Drawer */}
      <BillDetailsDrawer
        open={showBillDetails}
        onOpenChange={setShowBillDetails}
        bill={detailsBill}
        onCollect={() => {}}
        onPrint={() => {}}
      />

      {/* Claim Creation Modal */}
      <ClaimCreationModal
        open={showClaimCreation}
        onOpenChange={setShowClaimCreation}
        onComplete={handleClaimComplete}
        onSaveDraft={handleClaimDraft}
        onCancel={() => setShowClaimCreation(false)}
      />

      {/* Claim Edit Modal */}
      {editClaim && (
        <ClaimEditModal
          open={showClaimEdit}
          onOpenChange={setShowClaimEdit}
          claim={editClaim}
          mode={editMode}
          onSave={handleEditSave}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setShowClaimEdit(false);
            setEditClaim(null);
          }}
        />
      )}

      {/* Withdrawal Modal */}
      <ClaimWithdrawalModal
        open={showWithdrawal}
        onOpenChange={setShowWithdrawal}
        claim={withdrawClaim}
        onWithdraw={handleWithdraw}
        onRequestRetraction={handleRequestRetraction}
      />

      {/* Pay Out of Pocket Modal */}
      <PayOutOfPocketModal
        open={showPayOutOfPocket}
        onOpenChange={setShowPayOutOfPocket}
        claim={payOutOfPocketClaim}
        onConfirm={handlePayOutOfPocketConfirm}
      />
    </DashboardLayout>
  );
}
