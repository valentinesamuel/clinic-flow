// CashierShiftReport - End-of-shift reconciliation modal

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CashierShift } from '@/types/cashier.types';
import { calculateShiftStats } from '@/data/cashier-shifts';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CashierShiftReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: CashierShift;
  onEndShift: (closingBalance: number) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculateDuration(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hours ${minutes} minutes`;
}

export function CashierShiftReport({
  open,
  onOpenChange,
  shift,
  onEndShift,
}: CashierShiftReportProps) {
  const [closingBalance, setClosingBalance] = useState('');
  const stats = calculateShiftStats(shift);

  const expectedBalance = shift.openingBalance + stats.cashCollected;
  const actualClosing = parseFloat(closingBalance) || 0;
  const variance = actualClosing - expectedBalance;

  const getVarianceStatus = () => {
    if (!closingBalance) return null;
    if (variance === 0) return { label: 'Balanced', color: 'text-green-600', icon: CheckCircle2 };
    if (Math.abs(variance) <= 500) return { label: 'Minor variance', color: 'text-yellow-600', icon: AlertTriangle };
    return { label: 'Significant variance', color: 'text-red-600', icon: AlertTriangle };
  };

  const varianceStatus = getVarianceStatus();

  const handleSubmit = () => {
    if (actualClosing > 0) {
      onEndShift(actualClosing);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shift Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Shift Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cashier:</span>
              <span className="font-medium">{shift.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Station:</span>
              <span className="font-medium capitalize">{shift.station}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start:</span>
              <span className="font-medium">{formatDateTime(shift.startedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End:</span>
              <span className="font-medium">{formatDateTime(new Date().toISOString())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {calculateDuration(shift.startedAt)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Transaction Summary */}
          <div>
            <h4 className="font-medium mb-2">Transaction Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Transactions:</span>
                <span className="font-bold">{stats.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Collected:</span>
                <span className="font-bold">{formatCurrency(stats.totalCollected)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Breakdown by Method */}
          <div>
            <h4 className="font-medium mb-2">Breakdown by Method</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash:</span>
                <span>
                  {formatCurrency(stats.cashCollected)} (
                  {stats.totalCollected > 0
                    ? Math.round((stats.cashCollected / stats.totalCollected) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">POS/Card:</span>
                <span>
                  {formatCurrency(stats.cardCollected)} (
                  {stats.totalCollected > 0
                    ? Math.round((stats.cardCollected / stats.totalCollected) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer:</span>
                <span>
                  {formatCurrency(stats.transferCollected)} (
                  {stats.totalCollected > 0
                    ? Math.round((stats.transferCollected / stats.totalCollected) * 100)
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cash Reconciliation */}
          <div>
            <h4 className="font-medium mb-2">Cash Reconciliation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opening Balance:</span>
                <span>{formatCurrency(shift.openingBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash Collected:</span>
                <span>{formatCurrency(stats.cashCollected)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Expected Balance:</span>
                <span>{formatCurrency(expectedBalance)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closing-balance">Closing Balance</Label>
            <Input
              id="closing-balance"
              type="number"
              placeholder="Enter closing cash balance"
              value={closingBalance}
              onChange={(e) => setClosingBalance(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Variance Display */}
          {varianceStatus && (
            <div
              className={cn(
                'p-3 rounded-lg flex items-center gap-2',
                variance === 0 && 'bg-green-50 dark:bg-green-950',
                variance !== 0 && Math.abs(variance) <= 500 && 'bg-yellow-50 dark:bg-yellow-950',
                Math.abs(variance) > 500 && 'bg-red-50 dark:bg-red-950'
              )}
            >
              <varianceStatus.icon className={cn('h-5 w-5', varianceStatus.color)} />
              <div className="flex-1">
                <p className={cn('font-medium', varianceStatus.color)}>
                  {varianceStatus.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  Variance: {formatCurrency(variance)}
                </p>
              </div>
            </div>
          )}

          {Math.abs(variance) > 1000 && closingBalance && (
            <p className="text-xs text-muted-foreground">
              ⚠️ Large variances require supervisor approval
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!closingBalance || actualClosing <= 0}>
            End Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
