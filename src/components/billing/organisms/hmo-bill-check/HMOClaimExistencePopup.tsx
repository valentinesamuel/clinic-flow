import { HMOClaim } from '@/types/billing.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileCheck, Wallet, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface HMOClaimExistencePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingClaim: HMOClaim;
  onAddToExisting: () => void;
  onPayOutOfPocket: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HMOClaimExistencePopup({
  open,
  onOpenChange,
  existingClaim,
  onAddToExisting,
  onPayOutOfPocket,
}: HMOClaimExistencePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Existing HMO Claim Found</DialogTitle>
              <DialogDescription className="mt-1">
                This patient has a pending claim with their HMO provider
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Claim Info Card */}
          <div className="border rounded-lg p-4 bg-accent/50 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium font-mono">{existingClaim.claimNumber}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {existingClaim.hmoProviderName}
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {existingClaim.status.charAt(0).toUpperCase() +
                  existingClaim.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Claim Amount</p>
                <p className="font-semibold">
                  {formatCurrency(existingClaim.claimAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-semibold text-sm">
                  {format(new Date(existingClaim.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            {existingClaim.items && existingClaim.items.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  {existingClaim.items.length}{' '}
                  {existingClaim.items.length === 1 ? 'item' : 'items'} already
                  included
                </p>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              You can either add this new bill to the existing claim or have the
              patient pay out of pocket. Adding to the existing claim will consolidate
              all charges under one submission.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button
            onClick={onAddToExisting}
            className="w-full gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Add to Existing Claim
          </Button>
          <Button
            onClick={onPayOutOfPocket}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <Wallet className="h-4 w-4" />
            Pay Out of Pocket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
