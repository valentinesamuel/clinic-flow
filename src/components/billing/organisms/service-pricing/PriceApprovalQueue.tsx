// PriceApprovalQueue - CMO interface for approving price changes

import { useState, useMemo } from 'react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PriceApproval, ServiceCategory } from '@/types/cashier.types';
import { usePendingPriceApprovals, usePriceApprovals } from '@/hooks/queries/useServicePricingQueries';
import { useUpdatePriceApproval } from '@/hooks/mutations/useServicePricingMutations';
import {
  Check,
  X,
  ArrowRight,
  Clock,
  TrendingUp,
  Percent,
  CheckCheck,
} from 'lucide-react';
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

function getPriorityLevel(changePercentage: number): 'high' | 'medium' | 'low' {
  const absChange = Math.abs(changePercentage);
  if (absChange > 20) return 'high';
  if (absChange > 10) return 'medium';
  return 'low';
}

function getBorderColor(changePercentage: number): string {
  const absChange = Math.abs(changePercentage);
  if (absChange > 20) return 'border-l-red-500';
  if (absChange > 10) return 'border-l-yellow-500';
  return 'border-l-green-500';
}

export function PriceApprovalQueue() {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: pendingApprovalsData = [] } = usePendingPriceApprovals();
  const { data: allApprovals = [] } = usePriceApprovals();
  const updateApprovalMutation = useUpdatePriceApproval();

  const pendingApprovals = pendingApprovalsData as PriceApproval[];
  const approvalHistory = (allApprovals as PriceApproval[]).filter((a: PriceApproval) => a.status !== 'pending');

  const filteredPending = useMemo(() => {
    if (categoryFilter === 'all') return pendingApprovals;
    return pendingApprovals.filter((a) => a.category === categoryFilter);
  }, [pendingApprovals, categoryFilter]);

  const filteredHistory = useMemo(() => {
    if (categoryFilter === 'all') return approvalHistory;
    return approvalHistory.filter((a) => a.category === categoryFilter);
  }, [approvalHistory, categoryFilter]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalValueImpact = filteredPending.reduce((sum, approval) => {
      const impact = Math.abs(approval.newPrice - (approval.oldPrice || 0));
      return sum + impact;
    }, 0);

    const avgChange =
      filteredPending.length > 0
        ? filteredPending.reduce(
            (sum, approval) => sum + Math.abs(approval.changePercentage || 0),
            0
          ) / filteredPending.length
        : 0;

    return {
      pendingCount: filteredPending.length,
      totalValueImpact,
      avgChange,
    };
  }, [filteredPending]);

  const [selectedApproval, setSelectedApproval] = useState<PriceApproval | null>(
    null
  );
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
    if (!selectedApproval) return;

    updateApprovalMutation.mutateAsync({
      id: selectedApproval.id,
      status: 'approved',
      notes: approvalNotes || undefined,
      reviewerId: 'usr-cmo',
      reviewerName: 'Dr. Nwosu',
    });

    toast({
      title: 'Price Approved',
      description: `${selectedApproval.serviceName} price has been approved`,
    });

    setShowApproveModal(false);
    setSelectedApproval(null);
    setApprovalNotes('');
    setRefreshKey((k) => k + 1);
  };

  const confirmReject = () => {
    if (!selectedApproval) return;

    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    updateApprovalMutation.mutateAsync({
      id: selectedApproval.id,
      status: 'rejected',
      notes: rejectionReason,
      reviewerId: 'usr-cmo',
      reviewerName: 'Dr. Nwosu',
    });

    toast({
      title: 'Price Rejected',
      description: `${selectedApproval.serviceName} price change has been rejected`,
    });

    setShowRejectModal(false);
    setSelectedApproval(null);
    setRejectionReason('');
    setRefreshKey((k) => k + 1);
  };

  const handleApproveAll = () => {
    filteredPending.forEach((approval) => {
      updateApprovalMutation.mutateAsync({
        id: approval.id,
        status: 'approved',
        notes: 'Bulk approval',
        reviewerId: 'usr-cmo',
        reviewerName: 'Dr. Nwosu',
      });
    });

    toast({
      title: 'All Prices Approved',
      description: `${filteredPending.length} price changes have been approved`,
    });

    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold mt-2">{stats.pendingCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value Impact
                </p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(stats.totalValueImpact)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Change
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats.avgChange.toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price Approval Queue</CardTitle>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({filteredPending.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({filteredHistory.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending" className="space-y-4 mt-6">
              {filteredPending.length === 0 ? (
                <div className="py-12 text-center">
                  <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Pending Approvals</p>
                  <p className="text-muted-foreground">
                    All price changes have been reviewed
                  </p>
                </div>
              ) : (
                <>
                  {filteredPending.map((approval) => {
                    const priority = getPriorityLevel(
                      approval.changePercentage || 0
                    );
                    const borderColor = getBorderColor(
                      approval.changePercentage || 0
                    );

                    return (
                      <div
                        key={approval.id}
                        className={cn(
                          'p-4 border-l-4 border rounded-lg space-y-3 bg-muted/30',
                          borderColor
                        )}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">
                                {approval.serviceName}
                              </h4>
                              <Badge
                                variant={
                                  priority === 'high'
                                    ? 'destructive'
                                    : priority === 'medium'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {priority.toUpperCase()} PRIORITY
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-mono text-muted-foreground">
                                {approval.serviceCode}
                              </p>
                              <Badge variant="outline" className="text-xs capitalize">
                                {approval.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Price Comparison */}
                        <div
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg',
                            approval.isNewService
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-background border'
                          )}
                        >
                          {approval.isNewService ? (
                            <>
                              <Badge variant="default" className="font-semibold">
                                NEW SERVICE
                              </Badge>
                              <span className="font-bold text-xl ml-auto">
                                {formatCurrency(approval.newPrice)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground font-medium">
                                {formatCurrency(approval.oldPrice || 0)}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="font-bold text-xl">
                                {formatCurrency(approval.newPrice)}
                              </span>
                              <Badge
                                variant={
                                  (approval.changePercentage || 0) > 0
                                    ? 'destructive'
                                    : 'default'
                                }
                                className="ml-auto text-sm font-bold"
                              >
                                {(approval.changePercentage || 0) > 0 ? '+' : ''}
                                {approval.changePercentage?.toFixed(1)}%
                              </Badge>
                            </>
                          )}
                        </div>

                        <Separator />

                        {/* Request Info */}
                        <div className="text-sm space-y-1 bg-background/50 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">
                              Requested by:
                            </span>
                            <span className="font-medium">
                              {approval.requestedByName}{' '}
                              <span className="text-muted-foreground capitalize font-normal">
                                ({approval.requestedByRole.replace('_', ' ')})
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">
                              Date:
                            </span>
                            <span>{formatDateTime(approval.requestedAt)}</span>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-900">
                          <span className="text-muted-foreground font-medium">
                            Reason:{' '}
                          </span>
                          <span className="text-foreground">{approval.reason}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleReject(approval)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(approval)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Approve All Button */}
                  {filteredPending.length > 1 && (
                    <div className="pt-4 border-t">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Approve All {filteredPending.length} Requests
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Approve All Price Changes?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              You are about to approve {filteredPending.length}{' '}
                              pending price changes. This action will immediately
                              update all service prices.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleApproveAll}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
              {filteredHistory.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No History</p>
                  <p className="text-muted-foreground">
                    No approved or rejected requests yet
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price Change</TableHead>
                        <TableHead className="text-right">Change %</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reviewed By</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((approval) => (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {approval.serviceName}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {approval.serviceCode}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {approval.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {approval.isNewService ? (
                              <div>
                                <Badge variant="secondary" className="mb-1">
                                  NEW
                                </Badge>
                                <p className="font-semibold">
                                  {formatCurrency(approval.newPrice)}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">
                                  {formatCurrency(approval.oldPrice || 0)}
                                </span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="font-semibold">
                                  {formatCurrency(approval.newPrice)}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {approval.changePercentage !== undefined && (
                              <span
                                className={cn(
                                  'font-semibold',
                                  approval.changePercentage > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                )}
                              >
                                {approval.changePercentage > 0 ? '+' : ''}
                                {approval.changePercentage.toFixed(1)}%
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                approval.status === 'approved'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={cn(
                                approval.status === 'approved' &&
                                  'bg-green-600 hover:bg-green-700'
                              )}
                            >
                              {approval.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {approval.reviewedByName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {approval.reviewedAt
                                ? formatDateTime(approval.reviewedAt)
                                : '-'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve Price Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Service Info */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">{selectedApproval?.serviceName}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {selectedApproval?.serviceCode}
              </p>
            </div>

            {/* Price Comparison */}
            <div className="border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Price Comparison
              </p>
              {selectedApproval?.isNewService ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Service Price:</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedApproval.newPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current Price
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedApproval?.oldPrice || 0)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">
                      New Price
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedApproval?.newPrice || 0)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="approval-notes">Approval Notes (optional)</Label>
              <Textarea
                id="approval-notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any approval notes or comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveModal(false);
                setApprovalNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Price Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Service Info */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">{selectedApproval?.serviceName}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {selectedApproval?.serviceCode}
              </p>
            </div>

            {/* Price Info */}
            <div className="border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Proposed Price Change
              </p>
              {selectedApproval?.isNewService ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Requested Price:</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(selectedApproval.newPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    {formatCurrency(selectedApproval?.oldPrice || 0)}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xl font-bold">
                    {formatCurrency(selectedApproval?.newPrice || 0)}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    {(selectedApproval?.changePercentage || 0) > 0 ? '+' : ''}
                    {selectedApproval?.changePercentage?.toFixed(1)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            <div className="space-y-2">
              <Label htmlFor="rejection-reason" className="text-red-600 dark:text-red-400">
                Reason for Rejection *
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a clear reason why this price change is being rejected..."
                rows={4}
                className="border-red-200 dark:border-red-900 focus-visible:ring-red-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
