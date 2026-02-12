import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillItem } from '@/types/billing.types';
import { Shield } from 'lucide-react';

interface HMOBillSummaryProps {
  items: BillItem[];
  hmoTotalCoverage: number;
  patientTotalLiability: number;
  totalBill: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HMOBillSummary({
  items,
  hmoTotalCoverage,
  patientTotalLiability,
  totalBill,
}: HMOBillSummaryProps) {
  const coveragePercent = totalBill > 0 ? Math.round((hmoTotalCoverage / totalBill) * 100) : 0;

  const coveredCount = items.filter((i) => i.hmoStatus === 'covered').length;
  const partialCount = items.filter((i) => i.hmoStatus === 'partial').length;
  const notCoveredCount = items.filter((i) => i.hmoStatus === 'not_covered').length;
  const optedOutCount = items.filter((i) => i.hmoStatus === 'opted_out').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          HMO Coverage Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Bill</span>
          <span className="font-semibold">{formatCurrency(totalBill)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600">HMO Covers</span>
          <span className="font-semibold text-green-600">{formatCurrency(hmoTotalCoverage)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-amber-600">Patient Pays</span>
          <span className="font-semibold text-amber-600">{formatCurrency(patientTotalLiability)}</span>
        </div>

        {/* Coverage progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Coverage</span>
            <span>{coveragePercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Item counts */}
        <div className="flex flex-wrap gap-2 text-xs">
          {coveredCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
              {coveredCount} covered
            </span>
          )}
          {partialCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              {partialCount} partial
            </span>
          )}
          {notCoveredCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
              {notCoveredCount} not covered
            </span>
          )}
          {optedOutCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {optedOutCount} opted out
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
