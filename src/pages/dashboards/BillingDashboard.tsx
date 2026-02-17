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
  FileCheck,
  TrendingUp,
  User,
  DollarSign,
  CreditCard,
  TrendingDown,
  Building2,
} from "lucide-react";
import { QuickActionsDropdown } from "@/components/billing/molecules";
import { PaymentCollectionForm } from "@/components/billing/organisms/cashier-station/PaymentCollectionForm";
import { PaymentItem, PaymentClearance } from "@/types/billing.types";
import { Patient } from "@/types/patient.types";
import { useBills } from "@/hooks/queries/useBillQueries";
import { useToast } from "@/hooks/use-toast";
import { RevenueStatsCards } from "@/components/billing/RevenueStatsCards";
import { useAuth } from "@/hooks/useAuth";
import { usePatients } from "@/hooks/queries/usePatientQueries";

const hmoClaimsStatus = {
  pending: 24,
  approved: 18,
  rejected: 3,
  paid: 156,
};

const dailyRevenue = {
  cash: 385000,
  card: 127500,
  transfer: 245000,
  total: 757500,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const mockPaymentItems: PaymentItem[] = [
  {
    id: "item-1",
    description: "General Consultation",
    category: "consultation",
    quantity: 1,
    unitPrice: 15000,
    discount: 0,
    total: 15000,
  },
  {
    id: "item-2",
    description: "Lab Tests",
    category: "lab",
    quantity: 3,
    unitPrice: 5833,
    discount: 0,
    total: 17500,
    subItems: [
      {
        id: "sub-1",
        description: "FBC",
        category: "lab",
        quantity: 1,
        unitPrice: 5000,
        discount: 0,
        total: 5000,
      },
      {
        id: "sub-2",
        description: "MP",
        category: "lab",
        quantity: 1,
        unitPrice: 2500,
        discount: 0,
        total: 2500,
      },
      {
        id: "sub-3",
        description: "LFT",
        category: "lab",
        quantity: 1,
        unitPrice: 10000,
        discount: 0,
        total: 10000,
      },
    ],
  },
];

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch bills and patients data
  const { data: billsData = [] } = useBills();
  const { data: patientsData, isLoading: isPatientsLoading } = usePatients();
  const patients = patientsData?.data || [];

  // Calculate pending bills and today's revenue client-side
  const pendingBills = (billsData as any[]).filter(bill => bill.status === 'pending' || bill.balance > 0);
  const unpaidBills = pendingBills
    .slice(0, 4)
    .map((bill, index) => ({
      id: bill.id,
      patient: bill.patientName,
      patientId: bill.patientId,
      amount: bill.balance,
      daysOverdue: [15, 8, 3, 0][index] || 0,
      bill,
    }));

  const today = new Date().toISOString().split('T')[0];
  const todaysBills = (billsData as any[]).filter(bill =>
    bill.createdAt && bill.createdAt.startsWith(today)
  );
  const todaysRevenue = todaysBills.reduce((sum, bill) => sum + (bill.total || 0), 0);

  const basePath = user?.role === 'cashier' ? '/cashier'
    : user?.role === 'hospital_admin' ? '/hospital-admin/billing'
    : user?.role === 'cmo' ? '/cmo/billing' : '/cashier';

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);

  const handleRecordPayment = () => {
    // Use first patient from fetched data for demo
    const demoPatient = patients[0];
    if (!demoPatient) {
      toast({
        title: "No Patients",
        description: "No patient data available for demo",
        variant: "destructive",
      });
      return;
    }
    setSelectedPatient(demoPatient);
    setSelectedItems(mockPaymentItems);
    setShowPaymentModal(true);
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

  const handleSubmitClaim = () => {
    navigate(`${basePath}/claims?action=new`);
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

  const handleRevenueCardClick = (
    method: "cash" | "card" | "transfer" | "all",
  ) => {
    if (method === "all") {
      navigate(`${basePath}/payments?date=today`);
    } else {
      navigate(`${basePath}/payments?method=${method}`);
    }
  };

  return (
    <DashboardLayout allowedRoles={["cashier", "hospital_admin", "cmo"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Billing Dashboard
            </h1>
            <p className="text-muted-foreground">
              Payments, claims, and revenue tracking
            </p>
          </div>
          <QuickActionsDropdown
            onRecordPayment={handleRecordPayment}
            onSubmitClaim={handleSubmitClaim}
            onGenerateReceipt={handleGenerateReceipt}
            onDailyReport={handleDailyReport}
          />
        </div>

        {/* Daily Revenue - Clickable Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick("cash")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-green-100 dark:bg-green-900/20`}
                >
                  <DollarSign className={`h-4 w-4 text-green-600`} />
                </div>
                <CardDescription>Cash Payments</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {formatCurrency(dailyRevenue.cash)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% today</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick("card")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-blue-100 dark:bg-blue-900/20`}
                >
                  <CreditCard className={`h-4 w-4 text-blue-600`} />
                </div>
                <CardDescription>Card/POS Payments</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {formatCurrency(dailyRevenue.card)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-2% today</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick("transfer")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-purple-100 dark:bg-purple-900/20`}
                >
                  <Building2 className={`h-4 w-4 text-purple-600`} />
                </div>
                <CardDescription>Transfer Payments</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {formatCurrency(dailyRevenue.transfer)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>1% today</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => handleRevenueCardClick("all")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`flex p-1.5 rounded-md w-fit bg-secondary`}>
                  <TrendingUp className={`h-4 w-4 text-primary`} />
                </div>
                <CardDescription className="text-primary-foreground/80">
                  Total Today
                </CardDescription>
              </div>
              <CardTitle className="text-xl">
                {formatCurrency(dailyRevenue.total)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/80">
                All payment methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Unpaid Bills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Unpaid Bills
                </CardTitle>
                <CardDescription>
                  {unpaidBills.length} outstanding invoices
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`${basePath}/bills?status=pending`)}
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
            setSelectedPatient(null);
            setSelectedItems([]);
          }}
        />
      )}
    </DashboardLayout>
  );
}
