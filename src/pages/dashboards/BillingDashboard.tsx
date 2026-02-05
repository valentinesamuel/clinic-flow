import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Receipt,
  CreditCard,
  FileCheck,
  DollarSign,
  TrendingUp,
  User,
} from 'lucide-react';
import { PaymentCollectionForm } from '@/components/billing/organisms/cashier-station/PaymentCollectionForm';
import { PaymentItem, PaymentClearance } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { mockPatients } from '@/data/patients';
import { mockBills, getPendingBills } from '@/data/bills';
import { useToast } from '@/hooks/use-toast';

// Mock billing data
const unpaidBills = getPendingBills().slice(0, 4).map((bill, index) => ({
  id: bill.id,
  patient: bill.patientName,
  patientId: bill.patientId,
  amount: bill.balance,
  daysOverdue: [15, 8, 3, 0][index] || 0,
  bill,
}));

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

// Mock patient for demo
const mockPatient: Patient = mockPatients[0] || {
  id: 'pt-demo',
  mrn: 'PT-2026-00123',
  firstName: 'Aisha',
  lastName: 'Mohammed',
  dateOfBirth: '1985-03-15',
  gender: 'female',
  bloodGroup: 'O+',
  maritalStatus: 'married',
  phone: '+234 803 123 4567',
  address: '25 Marina Street, Lagos Island',
  state: 'Lagos',
  lga: 'Lagos Island',
  nationality: 'Nigerian',
  paymentType: 'cash',
  nextOfKin: {
    name: 'Ibrahim Mohammed',
    relationship: 'Husband',
    phone: '+234 803 987 6543',
  },
  allergies: [],
  chronicConditions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
};

const mockPaymentItems: PaymentItem[] = [
  {
    id: 'item-1',
    description: 'General Consultation',
    category: 'consultation',
    quantity: 1,
    unitPrice: 15000,
    discount: 0,
    total: 15000,
  },
  {
    id: 'item-2',
    description: 'Lab Tests',
    category: 'lab',
    quantity: 3,
    unitPrice: 5833,
    discount: 0,
    total: 17500,
    subItems: [
      { id: 'sub-1', description: 'FBC', category: 'lab', quantity: 1, unitPrice: 5000, discount: 0, total: 5000 },
      { id: 'sub-2', description: 'MP', category: 'lab', quantity: 1, unitPrice: 2500, discount: 0, total: 2500 },
      { id: 'sub-3', description: 'LFT', category: 'lab', quantity: 1, unitPrice: 10000, discount: 0, total: 10000 },
    ],
  },
];

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);

  const handleRecordPayment = () => {
    setSelectedPatient(mockPatient);
    setSelectedItems(mockPaymentItems);
    setShowPaymentModal(true);
  };

  const handleCollectBill = (billData: typeof unpaidBills[0]) => {
    const patient = mockPatients.find((p) => p.id === billData.patientId);
    if (!patient) {
      toast({
        title: 'Error',
        description: 'Patient not found',
        variant: 'destructive',
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
      title: 'Payment Successful',
      description: `Receipt ${clearance.receiptNumber} generated for ${formatCurrency(clearance.total)}`,
    });
    setShowPaymentModal(false);
    setSelectedPatient(null);
    setSelectedItems([]);
  };

  const handleSubmitClaim = () => {
    navigate('/billing/claims?action=new');
  };

  const handleGenerateReceipt = () => {
    toast({
      title: 'Generate Receipt',
      description: 'Please select a paid bill to generate a receipt',
    });
  };

  const handleDailyReport = () => {
    toast({
      title: 'Daily Report',
      description: 'Daily report generation - Coming Soon',
    });
  };

  const handleRevenueCardClick = (method: 'cash' | 'card' | 'hmo' | 'all') => {
    if (method === 'all') {
      navigate('/billing/payments?date=today');
    } else {
      navigate(`/billing/payments?method=${method}`);
    }
  };

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
            <Button variant="outline" onClick={handleSubmitClaim}>
              <FileCheck className="h-4 w-4 mr-2" />
              Submit Claim
            </Button>
            <Button onClick={handleRecordPayment}>
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Daily Revenue - Clickable Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick('cash')}
          >
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
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick('card')}
          >
            <CardHeader className="pb-2">
              <CardDescription>Card Payments</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.card)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">POS transactions</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleRevenueCardClick('hmo')}
          >
            <CardHeader className="pb-2">
              <CardDescription>HMO Payments</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.hmo)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Insurance claims</p>
            </CardContent>
          </Card>
          <Card 
            className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => handleRevenueCardClick('all')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80">Total Today</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(dailyRevenue.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/80">All payment methods</p>
            </CardContent>
          </Card>
        </div>

        {/* HMO Claims Status - Non-clickable */}
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/billing/bills?status=pending')}
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
                  <Button size="sm" variant="outline" onClick={() => handleCollectBill(bill)}>
                    Collect
                  </Button>
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
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleRecordPayment}>
                <CreditCard className="h-5 w-5 mb-2" />
                <span className="text-xs">Record Payment</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleGenerateReceipt}>
                <Receipt className="h-5 w-5 mb-2" />
                <span className="text-xs">Generate Receipt</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleSubmitClaim}>
                <FileCheck className="h-5 w-5 mb-2" />
                <span className="text-xs">Submit Claim</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleDailyReport}>
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="text-xs">Daily Report</span>
              </Button>
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
