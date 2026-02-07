// CashierDashboard - Main cashier interface with shift management and payment queue

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Receipt,
  CreditCard,
  Banknote,
  Clock,
  Play,
  Square,
  ArrowRight,
  Users,
} from 'lucide-react';
import { CashierStation, CashierShift, ShiftTransaction } from '@/types/cashier.types';
import { Bill, PaymentItem } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { getCurrentShift, calculateShiftStats } from '@/data/cashier-shifts';
import { getPendingBillsByDepartment } from '@/data/bills';
import { getPatientById } from '@/data/patients';
import { PaymentCollectionForm } from './PaymentCollectionForm';
import { CashierShiftReport } from './CashierShiftReport';
import { cn } from '@/lib/utils';

interface CashierDashboardProps {
  station: CashierStation;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const stationLabels: Record<CashierStation, string> = {
  main: 'Main Reception',
  lab: 'Laboratory',
  pharmacy: 'Pharmacy',
};

const departmentMap: Record<CashierStation, string> = {
  main: 'front_desk',
  lab: 'lab',
  pharmacy: 'pharmacy',
};

export function CashierDashboard({ station }: CashierDashboardProps) {
  const [shift, setShift] = useState<CashierShift | null>(
    getCurrentShift(station) || null
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showShiftReport, setShowShiftReport] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Get pending bills for this station's department
  const department = departmentMap[station];
  const pendingBills = station === 'main' 
    ? getPendingBillsByDepartment('all')
    : getPendingBillsByDepartment(department as any);

  // Calculate shift stats
  const stats = shift ? calculateShiftStats(shift) : null;

  const handleStartShift = () => {
    const newShift: CashierShift = {
      id: `shift-${Date.now()}`,
      cashierId: 'usr-current',
      cashierName: 'Current Cashier',
      station,
      startedAt: new Date().toISOString(),
      status: 'active',
      openingBalance: 50000,
      transactions: [],
    };
    setShift(newShift);
  };

  const handleEndShift = () => {
    setShowShiftReport(true);
  };

  const handleShiftClosed = (closingBalance: number) => {
    if (shift) {
      setShift({
        ...shift,
        status: 'closed',
        endedAt: new Date().toISOString(),
        closingBalance,
      });
    }
    setShowShiftReport(false);
  };

  const handleCollectPayment = (bill: Bill) => {
    const patient = getPatientById(bill.patientId);
    if (patient) {
      setSelectedBill(bill);
      setSelectedPatient(patient);
      setShowPaymentForm(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentForm(false);
    setSelectedBill(null);
    setSelectedPatient(null);
    // In real app, would refresh data
  };

  const billToPaymentItems = (bill: Bill): PaymentItem[] => {
    return bill.items.map((item) => ({
      id: item.id,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Cashier - {stationLabels[station]}
          </h1>
          <p className="text-muted-foreground text-sm">
            {shift ? 'Shift in progress' : 'No active shift'}
          </p>
        </div>
        {!shift ? (
          <Button onClick={handleStartShift}>
            <Play className="h-4 w-4 mr-2" />
            Start Shift
          </Button>
        ) : (
          <Button variant="destructive" onClick={handleEndShift}>
            <Square className="h-4 w-4 mr-2" />
            End Shift
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.transactionCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(stats?.totalCollected || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Cash
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(stats?.cashCollected || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              POS/Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(stats?.cardCollected || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Payment Queue ({pendingBills.length} waiting)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingBills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No pending payments in queue
            </p>
          ) : (
            <div className="space-y-3">
              {pendingBills.slice(0, 10).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {bill.patientName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bill.patientName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{bill.patientMrn}</span>
                        <span>•</span>
                        <span className="capitalize">{bill.department}</span>
                        {bill.billingCode && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="font-mono">
                              {bill.billingCode}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(bill.balance)}</p>
                      <Badge
                        variant={bill.status === 'partial' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {bill.status}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleCollectPayment(bill)}
                      disabled={!shift}
                    >
                      Collect
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <Button variant="link" size="sm">
            View All →
          </Button>
        </CardHeader>
        <CardContent>
          {!shift || shift.transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No transactions yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shift.transactions
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .slice(0, 10)
                  .map((txn) => (
                    <TableRow key={txn.id} className="cursor-pointer">
                      <TableCell className="font-mono">
                        {txn.receiptNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{txn.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {txn.patientMrn}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            txn.paymentMethod === 'cash' &&
                              'border-green-500 text-green-600',
                            txn.paymentMethod === 'card' &&
                              'border-blue-500 text-blue-600',
                            txn.paymentMethod === 'transfer' &&
                              'border-purple-500 text-purple-600'
                          )}
                        >
                          {txn.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTime(txn.timestamp)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Collection Modal */}
      {selectedBill && selectedPatient && (
        <PaymentCollectionForm
          open={showPaymentForm}
          patient={selectedPatient}
          items={billToPaymentItems(selectedBill)}
          onComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedBill(null);
            setSelectedPatient(null);
          }}
        />
      )}

      {/* Shift Report Modal */}
      {shift && (
        <CashierShiftReport
          open={showShiftReport}
          onOpenChange={setShowShiftReport}
          shift={shift}
          onEndShift={handleShiftClosed}
        />
      )}
    </div>
  );
}
