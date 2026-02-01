import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Receipt,
  CreditCard,
  FileCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  User,
} from 'lucide-react';

// Mock billing data
const unpaidBills = [
  { id: 1, patient: 'Chidinma Obi', amount: 45000, daysOverdue: 15 },
  { id: 2, patient: 'Abdul Salam', amount: 127500, daysOverdue: 8 },
  { id: 3, patient: 'Grace Okoro', amount: 32000, daysOverdue: 3 },
  { id: 4, patient: 'Tunde Fashola', amount: 89000, daysOverdue: 0 },
];

const hmoClaimsStatus = {
  pending: 24,
  approved: 18,
  rejected: 3,
  paid: 156,
};

const dailyRevenue = {
  cash: 385000,
  card: 127500,
  hmo: 245000,
  total: 757500,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BillingDashboard() {
  return (
    <DashboardLayout allowedRoles={['billing']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing Dashboard</h1>
            <p className="text-muted-foreground">Payments, claims, and revenue tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileCheck className="h-4 w-4 mr-2" />
              Submit Claim
            </Button>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cash Payments</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.cash)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-success">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% today</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Card Payments</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.card)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">POS transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>HMO Payments</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.hmo)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Insurance claims</p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80">Total Today</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/80">All payment methods</p>
            </CardContent>
          </Card>
        </div>

        {/* HMO Claims Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              HMO Claims Status
            </CardTitle>
            <CardDescription>Current claims breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-2xl font-bold text-warning">{hmoClaimsStatus.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-2xl font-bold text-success">{hmoClaimsStatus.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-2xl font-bold text-destructive">{hmoClaimsStatus.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-primary">{hmoClaimsStatus.paid}</p>
                <p className="text-sm text-muted-foreground">Paid (YTD)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unpaid Bills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Unpaid Bills
                </CardTitle>
                <CardDescription>{unpaidBills.length} outstanding invoices</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
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
                    <p className="text-sm text-muted-foreground">{formatCurrency(bill.amount)}</p>
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
                  <Button size="sm" variant="outline">Collect</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col">
                <CreditCard className="h-5 w-5 mb-2" />
                <span className="text-xs">Record Payment</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Receipt className="h-5 w-5 mb-2" />
                <span className="text-xs">Generate Receipt</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <FileCheck className="h-5 w-5 mb-2" />
                <span className="text-xs">Submit Claim</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="text-xs">Daily Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
