import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, CreditCard, FileCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { Bill } from '@/types/billing.types';
import { getDepartmentLabel, getDepartmentVariant } from '@/utils/billingDepartment';

interface BillingOverviewCardProps {
  bills: Bill[];
  pendingClaimsCount: number;
  totalPendingAmount: number;
  routePrefix: string;
  showDepartmentBadge?: boolean;
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

export function BillingOverviewCard({
  bills,
  pendingClaimsCount,
  totalPendingAmount,
  routePrefix,
  showDepartmentBadge = false,
}: BillingOverviewCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Recent Bills
            </CardTitle>
            <CardDescription>Latest billing activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(`${routePrefix}/billing/bills`)}>
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent bills</p>
        ) : (
          bills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => navigate(`${routePrefix}/billing/bills`)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bill.patientName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{bill.billNumber}</span>
                  {showDepartmentBadge && bill.department !== 'all' && (
                    <Badge variant={getDepartmentVariant(bill.department)} className="text-[10px] px-1 py-0">
                      {getDepartmentLabel(bill.department)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(bill.total)}</span>
                <Badge variant={statusConfig[bill.status].variant} className="text-xs">
                  {statusConfig[bill.status].label}
                </Badge>
              </div>
            </div>
          ))
        )}

        {/* Quick Stats */}
        <div className="pt-3 border-t grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg bg-destructive/10 cursor-pointer hover:bg-destructive/20 transition-colors"
            onClick={() => navigate(`${routePrefix}/billing/bills?status=pending`)}
          >
            <div className="flex items-center gap-2 text-destructive mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Pending</span>
            </div>
            <p className="text-lg font-bold text-destructive">{formatCurrency(totalPendingAmount)}</p>
          </div>
          <div
            className="p-3 rounded-lg bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => navigate(`${routePrefix}/billing/claims`)}
          >
            <div className="flex items-center gap-2 text-primary mb-1">
              <FileCheck className="h-4 w-4" />
              <span className="text-xs font-medium">HMO Claims</span>
            </div>
            <p className="text-lg font-bold text-primary">{pendingClaimsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
