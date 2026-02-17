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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentsTable } from "@/components/billing/organisms/tables/PaymentsTable";
import { QueuePagination } from "@/components/molecules/queue/QueuePagination";
import { PaymentMethod, Bill } from "@/types/billing.types";
import {
  PaymentRecord,
  getPaymentsPaginated,
  getDailyRevenue,
} from "@/data/payments";
import {
  Search,
  CreditCard,
  ArrowLeft,
  Download,
  Banknote,
  Building2,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getUserBillingDepartment } from "@/utils/billingDepartment";
import { useBills } from "@/hooks/queries/useBillQueries";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PaymentsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const userDepartment = user ? getUserBillingDepartment(user) : 'all';

  // Fetch bills data for bill lookups
  const { data: billsData = [] } = useBills();
  const getBillById = (billId: string) => (billsData as Bill[]).find((b: Bill) => b.id === billId);

  const initialMethod = searchParams.get("method") as PaymentMethod | null;
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">(
    initialMethod || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Fetch payments with filters
  const {
    data: allPayments,
    total: rawTotal,
    totalPages: rawTotalPages,
  } = getPaymentsPaginated(currentPage, pageSize, {
    method: methodFilter !== "all" ? methodFilter : undefined,
    search: searchQuery || undefined,
  });

  // Filter payments by department for cashier role
  const payments = userDepartment === 'all'
    ? allPayments
    : allPayments.filter((payment) => {
        const bill = getBillById(payment.billId);
        return bill ? bill.department === userDepartment : true;
      });
  const total = userDepartment === 'all' ? rawTotal : payments.length;
  const totalPages = userDepartment === 'all' ? rawTotalPages : Math.max(1, Math.ceil(payments.length / pageSize));

  // Today's revenue
  const dailyRevenue = getDailyRevenue();

  const handleViewReceipt = (payment: PaymentRecord) => {
    toast({
      title: "View Receipt",
      description: `Viewing ${payment.receiptNumber}`,
    });
  };

  const handleReprint = (payment: PaymentRecord) => {
    toast({
      title: "Reprint",
      description: `Reprinting ${payment.receiptNumber}`,
    });
  };

  const handleEmail = (payment: PaymentRecord) => {
    toast({
      title: "Email Sent",
      description: `Receipt emailed for ${payment.receiptNumber}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Exporting transactions to CSV...",
    });
  };

  return (
    <DashboardLayout allowedRoles={["cashier", "hospital_admin", "cmo"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Payments & Transactions
              </h1>
              <p className="text-muted-foreground">
                Payment history and receipts
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Revenue Summary */}
        <div className="grid gap-5 md:grid-cols-5">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
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

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
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

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
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

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex p-1.5 rounded-md w-fit bg-teal-100 dark:bg-teal-900/20`}
                >
                  <Shield className={`h-4 w-4 text-teal-600`} />
                </div>
                <CardDescription>HMO Payments</CardDescription>
              </div>
              <CardTitle className="text-xl font-bold ">
                {formatCurrency(dailyRevenue.total)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>1% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
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
                    setMethodFilter(value as PaymentMethod | "all");
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
