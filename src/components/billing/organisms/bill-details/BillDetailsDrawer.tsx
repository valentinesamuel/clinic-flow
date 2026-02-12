import { format } from 'date-fns';
import {
  Receipt,
  User,
  FileText,
  Clock,
  CreditCard,
  Printer,
  Stethoscope,
  FlaskConical,
  Pill,
  Activity,
  MoreHorizontal,
} from 'lucide-react';
import { Bill, BillItem, ServiceCategory } from '@/types/billing.types';
import { Patient } from '@/types/patient.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { HMOBillSummary } from '@/components/billing/molecules/hmo/HMOBillSummary';
import { PaymentAllocationBar } from '@/components/billing/molecules/payment/PaymentAllocationBar';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  receiptNumber: string;
}

interface BillDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill | null;
  patient?: Patient | null;
  payments?: Payment[];
  onCollect?: () => void;
  onCreateClaim?: () => void;
  onPrint?: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const statusConfig: Record<Bill['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'destructive' },
  partial: { label: 'Partial', variant: 'secondary' },
  paid: { label: 'Paid', variant: 'default' },
  waived: { label: 'Waived', variant: 'outline' },
  refunded: { label: 'Refunded', variant: 'outline' },
};

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  consultation: <Stethoscope className="h-4 w-4" />,
  lab: <FlaskConical className="h-4 w-4" />,
  pharmacy: <Pill className="h-4 w-4" />,
  procedure: <Activity className="h-4 w-4" />,
  admission: <FileText className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

export function BillDetailsDrawer({
  open,
  onOpenChange,
  bill,
  patient,
  payments = [],
  onCollect,
  onCreateClaim,
  onPrint,
}: BillDetailsDrawerProps) {
  if (!bill) return null;

  const statusCfg = statusConfig[bill.status];
  const canCollect = bill.status === 'pending' || bill.status === 'partial';
  const canCreateClaim = bill.paymentMethod === 'hmo' && bill.balance > 0 && !bill.hmoClaimId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bill Details</p>
              <SheetTitle className="text-xl">{bill.billNumber}</SheetTitle>
            </div>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5">
            {/* Patient Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{bill.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">MRN</span>
                  <span className="text-sm font-mono">{bill.patientMrn}</span>
                </div>
                {patient?.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Type</span>
                  <InsuranceBadge
                    paymentType={patient?.paymentType || (bill.paymentMethod === 'hmo' ? 'hmo' : 'cash')}
                    hmoName={patient?.hmoDetails?.providerName}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bill Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {format(new Date(bill.createdAt), 'dd MMM yyyy, h:mm a')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created By</span>
                  <span className="text-sm">{bill.createdBy}</span>
                </div>
                {bill.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Paid At</span>
                    <span className="text-sm">
                      {format(new Date(bill.paidAt), 'dd MMM yyyy, h:mm a')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Items ({bill.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bill.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground">
                        {categoryIcons[item.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                          {item.discount > 0 && (
                            <span className="text-destructive ml-1">
                              (-{formatCurrency(item.discount)})
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-medium shrink-0">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amounts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Amounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(bill.subtotal)}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-destructive">-{formatCurrency(bill.discount)}</span>
                  </div>
                )}
                {bill.tax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(bill.tax)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(bill.total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-primary">{formatCurrency(bill.amountPaid)}</span>
                </div>
                <div className={cn(
                  "flex items-center justify-between font-medium",
                  bill.balance > 0 && "text-destructive"
                )}>
                  <span>Balance</span>
                  <span>{formatCurrency(bill.balance)}</span>
                </div>
              </CardContent>
            </Card>

            {/* HMO Coverage Summary */}
            {bill.items.some(item => item.hmoStatus) && (
              <HMOBillSummary
                items={bill.items}
                hmoTotalCoverage={bill.hmoTotalCoverage || 0}
                patientTotalLiability={bill.patientTotalLiability || 0}
                totalBill={bill.total}
              />
            )}

            {/* Payment Allocation Bar */}
            {bill.paymentSplits && bill.paymentSplits.length > 1 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentAllocationBar splits={bill.paymentSplits} totalDue={bill.total} />
                </CardContent>
              </Card>
            )}

            {/* Payment History */}
            {payments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">
                            {formatCurrency(payment.amount)} - {payment.method}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.date), 'dd MMM, h:mm a')} • {payment.receiptNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {bill.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">{bill.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t bg-muted/30 space-y-2">
          <div className="flex gap-2">
            {onPrint && (
              <Button variant="outline" className="flex-1" onClick={onPrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
            )}
            {canCollect && onCollect && (
              <Button className="flex-1" onClick={onCollect}>
                <CreditCard className="h-4 w-4 mr-2" />
                Collect Payment
              </Button>
            )}
          </div>
          {canCreateClaim && onCreateClaim && (
            <Button variant="secondary" className="w-full" onClick={onCreateClaim}>
              <FileText className="h-4 w-4 mr-2" />
              Create HMO Claim
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
