import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CoverageIndicator } from '../atoms/CoverageIndicator';
import { PriceTag } from '../atoms/PriceTag';
import { PayerType, ResolvedPrice, FinancialSummary } from '@/types/financial.types';
import { Receipt } from 'lucide-react';

interface FinancialSidebarProps {
  resolvedPrices: ResolvedPrice[];
  summary: FinancialSummary;
  payerType: PayerType;
  hmoName?: string;
}

export function FinancialSidebar({ resolvedPrices, summary, payerType, hmoName }: FinancialSidebarProps) {
  const labItems = resolvedPrices.filter(p => p.category === 'lab');
  const pharmItems = resolvedPrices.filter(p => p.category === 'pharmacy');
  const isHMO = payerType === 'hmo';

  if (resolvedPrices.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Cost Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Add lab orders or prescriptions to see cost estimates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Cost Estimate
          </CardTitle>
          <Badge variant={isHMO ? 'default' : 'secondary'} className="text-xs">
            {isHMO ? (hmoName || 'HMO') : payerType === 'corporate' ? 'Corporate' : 'Cash'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lab items */}
        {labItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lab Tests</p>
            {labItems.map((item, i) => (
              <div key={`${item.itemId}-${i}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isHMO && <CoverageIndicator status={item.coverageStatus} />}
                  <span className="text-xs truncate">{item.itemName}</span>
                </div>
                <PriceTag
                  amount={item.payerPrice}
                  strikethrough={isHMO && item.standardPrice !== item.payerPrice ? item.standardPrice : undefined}
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-medium">Lab Subtotal</span>
              <PriceTag amount={summary.labTotal} />
            </div>
          </div>
        )}

        {/* Pharmacy items */}
        {pharmItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pharmacy</p>
            {pharmItems.map((item, i) => (
              <div key={`${item.itemId}-${i}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isHMO && <CoverageIndicator status={item.coverageStatus} />}
                  <span className="text-xs truncate">{item.itemName}</span>
                </div>
                <PriceTag
                  amount={item.payerPrice}
                  strikethrough={isHMO && item.standardPrice !== item.payerPrice ? item.standardPrice : undefined}
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-medium">Pharmacy Subtotal</span>
              <PriceTag amount={summary.pharmacyTotal} />
            </div>
          </div>
        )}

        <Separator />

        {/* Totals */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <PriceTag amount={summary.grandTotal} size="md" />
          </div>
          {isHMO && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Patient Pays</span>
                <PriceTag amount={summary.patientTotal} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">HMO Covers</span>
                <PriceTag amount={summary.hmoTotal} />
              </div>
            </>
          )}
        </div>

        {/* Coverage legend for HMO patients */}
        {isHMO && (
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Coverage Legend</p>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-muted-foreground">Fully covered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-[10px] text-muted-foreground">Copay applies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-muted-foreground">Not covered</span>
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          * Estimates only. Final billing may differ.
        </p>
      </CardContent>
    </Card>
  );
}
