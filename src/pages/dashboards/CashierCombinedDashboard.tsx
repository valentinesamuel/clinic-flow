import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  TrendingUp,
  User,
  DollarSign,
  CreditCard,
  TrendingDown,
  Building2,
  QrCode,
} from "lucide-react";
import { QuickActionsDropdown } from "@/components/billing/molecules";
import { CashierDashboard } from "@/components/billing/organisms/cashier-station/CashierDashboard";
import { CodePaymentProcessor } from "@/components/billing/organisms/billing-codes/CodePaymentProcessor";
import { PaymentCollectionForm } from "@/components/billing/organisms/cashier-station/PaymentCollectionForm";
import {
  PaymentItem,
  PaymentClearance,
  BillingDepartment,
  Bill,
} from "@/types/billing.types";
import { CashierStation } from "@/types/cashier.types";
import { Patient } from "@/types/patient.types";
import { useBills } from "@/hooks/queries/useBillQueries";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserBillingDepartment,
  getDepartmentLabel,
} from "@/utils/billingDepartment";
import { usePatients } from "@/hooks/queries/usePatientQueries";

const deptToStation: Record<BillingDepartment, CashierStation> = {
  front_desk: "main",
  lab: "lab",
  pharmacy: "pharmacy",
  nursing: "main",
  inpatient: "main",
  all: "main",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CashierCombinedDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch patients and bills data
  const { data: patientsData } = usePatients();
  const patients = patientsData?.data || [];
  const { data: billsData = [] } = useBills();

  const department = user ? getUserBillingDepartment(user) : "front_desk";
  const station = deptToStation[department as BillingDepartment] || "main";

  // Filter bills by department client-side
  const pendingBills = (billsData as Bill[]).filter((bill: Bill) =>
    (bill.status === 'pending' || bill.balance > 0) &&
    (department === 'all' || bill.department === department)
  );

  const unpaidBills = pendingBills.slice(0, 4).map((bill, index) => ({
    id: bill.id,
    patient: bill.patientName,
    patientId: bill.patientId,
    amount: bill.balance,
    daysOverdue: [15, 8, 3, 0][index] || 0,
    bill,
  }));

  // Revenue stats (dept-scoped)
  const totalPending = pendingBills.reduce((sum, b) => sum + b.balance, 0);
  const totalCollected = pendingBills.reduce(
    (sum, b) => sum + b.amountPaid,
    0,
  );

  const [showCodeProcessor, setShowCodeProcessor] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);

  const handleCodePaymentComplete = () => {
    toast({
      title: "Payment Processed",
      description: "Billing code payment completed successfully",
    });
  };

  const handleRecordPayment = () => {
    const patient = patients[0];
    if (patient) {
      setSelectedPatient(patient);
      setSelectedItems([]);
      setShowPaymentModal(true);
    }
  };

  const handleSubmitClaim = () => {
    navigate("/cashier/claims?action=new");
  };

  const handleGenerateReceipt = () => {
    toast({
      title: "Generate Receipt",
      description: "Please select a paid bill to generate a receipt",
    });
  };

  const handleDailyReport = () => {
    toast({
      title: "Daily Report",
      description: "Daily report generation - Coming Soon",
    });
  };

  const handleCollectBill = (billData: (typeof unpaidBills)[0]) => {
    const patient = patients.find((p) => p.id === billData.patientId);
    if (!patient) {
      toast({
        title: "Error",
        description: "Patient not found",
        variant: "destructive",
      });
      return;
    }

    const items: PaymentItem[] = billData.bill.items.map((item) => ({
      id: item.id,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total,
    }));

    setSelectedPatient(patient);
    setSelectedItems(items);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (clearance: PaymentClearance) => {
    toast({
      title: "Payment Successful",
      description: `Receipt ${clearance.receiptNumber} generated for ${formatCurrency(clearance.total)}`,
    });
    setShowPaymentModal(false);
    setSelectedPatient(null);
    setSelectedItems([]);
  };

  return (
    <DashboardLayout allowedRoles={["cashier"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Cashier Dashboard
            </h1>
            <p className="text-muted-foreground">
              {getDepartmentLabel(department as BillingDepartment)} &mdash;
              Payments, bills & cashier station
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCodeProcessor(true)}
              variant="outline"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Process Code
            </Button>
            <QuickActionsDropdown
              onRecordPayment={handleRecordPayment}
              onSubmitClaim={handleSubmitClaim}
              onGenerateReceipt={handleGenerateReceipt}
              onDailyReport={handleDailyReport}
            />
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex p-1.5 rounded-md w-fit bg-amber-100 dark:bg-amber-900/20">
                  <Receipt className="h-4 w-4 text-amber-600" />
                </div>
                <CardDescription>Pending Bills</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold">
                {pendingBills.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex p-1.5 rounded-md w-fit bg-red-100 dark:bg-red-900/20">
                  <DollarSign className="h-4 w-4 text-red-600" />
                </div>
                <CardDescription>Total Outstanding</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold">
                {formatCurrency(totalPending)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>To collect</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex p-1.5 rounded-md w-fit bg-green-100 dark:bg-green-900/20">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <CardDescription>Amount Collected</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold">
                {formatCurrency(totalCollected)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Partial payments</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex p-1.5 rounded-md w-fit bg-secondary">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <CardDescription className="text-primary-foreground/80">
                  Station
                </CardDescription>
              </div>
              <CardTitle className="text-xl">
                {station === "main"
                  ? "Main"
                  : station === "lab"
                    ? "Laboratory"
                    : "Pharmacy"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/80">
                Active cashier station
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cashier Station */}
        <CashierDashboard station={station} />

        {/* Dept Unpaid Bills */}
        {unpaidBills.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Unpaid Bills
                  </CardTitle>
                  <CardDescription>
                    {unpaidBills.length} outstanding in{" "}
                    {getDepartmentLabel(department as BillingDepartment)}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate("/cashier/bills?status=pending")
                  }
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unpaidBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{bill.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(bill.amount)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {bill.daysOverdue > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {bill.daysOverdue} days overdue
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Due today
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCollectBill(bill)}
                    >
                      Collect
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Code Payment Processor */}
      <CodePaymentProcessor
        open={showCodeProcessor}
        onOpenChange={setShowCodeProcessor}
        onComplete={handleCodePaymentComplete}
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
            setSelectedPatient(null);
            setSelectedItems([]);
          }}
        />
      )}
    </DashboardLayout>
  );
}
