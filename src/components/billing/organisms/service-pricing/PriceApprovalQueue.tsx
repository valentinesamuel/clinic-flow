// PriceApprovalQueue - CMO interface for approving price changes

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PriceApproval } from '@/types/cashier.types';
import { getPendingApprovals } from '@/data/service-pricing';
import { Check, X, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

export function PriceApprovalQueue() {
  const { toast } = useToast();
  const pendingApprovals = getPendingApprovals();

  const [selectedApproval, setSelectedApproval] = useState<PriceApproval | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (approval: PriceApproval) => {
    setSelectedApproval(approval);
    setShowApproveModal(true);
  };

  const handleReject = (approval: PriceApproval) => {
    setSelectedApproval(approval);
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    toast({
      title: 'Price Approved',
      description: `${selectedApproval?.serviceName} price has been approved`,
    });
    setShowApproveModal(false);
    setSelectedApproval(null);
    setApprovalNotes('');
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Price Rejected',
      description: `${selectedApproval?.serviceName} price change has been rejected`,
    });
    setShowRejectModal(false);
    setSelectedApproval(null);
    setRejectionReason('');
  };

  if (pendingApprovals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No Pending Approvals</p>
          <p className="text-muted-foreground">
            All price changes have been reviewed
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Price Approvals ({pendingApprovals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div
              key={approval.id}
              className="p-4 border rounded-lg space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{approval.serviceName}</h4>
                  <p className="text-sm font-mono text-muted-foreground">
                    {approval.serviceCode}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {approval.category}
                </Badge>
              </div>

              {/* Price Change */}
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  approval.isNewService
                    ? 'bg-primary/10'
                    : 'bg-muted'
                )}
              >
                {approval.isNewService ? (
                  <>
                    <Badge variant="secondary">New Service</Badge>
                    <span className="font-bold text-lg">
                      {formatCurrency(approval.newPrice)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">
                      {formatCurrency(approval.oldPrice || 0)}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-bold text-lg">
                      {formatCurrency(approval.newPrice)}
                    </span>
                    <Badge
                      variant={
                        (approval.changePercentage || 0) > 0
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="ml-auto"
                    >
                      {(approval.changePercentage || 0) > 0 ? '+' : ''}
                      {approval.changePercentage?.toFixed(1)}%
                    </Badge>
                  </>
                )}
              </div>

              <Separator />

              {/* Request Info */}
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested by:</span>
                  <span>
                    {approval.requestedByName}{' '}
                    <span className="text-muted-foreground capitalize">
                      ({approval.requestedByRole.replace('_', ' ')})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formatDateTime(approval.requestedAt)}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="text-sm">
                <span className="text-muted-foreground">Reason: </span>
                <span>{approval.reason}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => handleReject(approval)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApprove(approval)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Price Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Approve new price of{' '}
              <strong>{formatCurrency(selectedApproval?.newPrice || 0)}</strong>{' '}
              for <strong>{selectedApproval?.serviceName}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="notes">Approval Notes (optional)</Label>
              <Textarea
                id="notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Price Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Reject price change for <strong>{selectedApproval?.serviceName}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this is being rejected..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
