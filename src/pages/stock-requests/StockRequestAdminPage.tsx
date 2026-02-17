import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Clock, AlertTriangle, CheckCircle, Package, MoreHorizontal, Check, X, MessageSquare, Forward, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useStockRequests, usePendingStockRequests, useUrgentPendingStockRequests } from '@/hooks/queries/useInventoryQueries';
import { useUpdateStockRequestStatus } from '@/hooks/mutations/useInventoryMutations';
import type { StockRequest, StockRequestStatus, StockRequestUrgency } from '@/types/stock-request.types';
import type { UserRole } from '@/types/auth.types';

export default function StockRequestAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateStockRequestMutation = useUpdateStockRequestStatus();
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Filters
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | StockRequestUrgency>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Action dialogs state
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; request: StockRequest | null }>({ open: false, request: null });
  const [partialApproveDialog, setPartialApproveDialog] = useState<{ open: boolean; request: StockRequest | null }>({ open: false, request: null });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; request: StockRequest | null }>({ open: false, request: null });
  const [infoDialog, setInfoDialog] = useState<{ open: boolean; request: StockRequest | null }>({ open: false, request: null });
  const [forwardDialog, setForwardDialog] = useState<{ open: boolean; request: StockRequest | null }>({ open: false, request: null });

  // Form states
  const [approveNotes, setApproveNotes] = useState('');
  const [partialApproveNotes, setPartialApproveNotes] = useState('');
  const [partialQuantities, setPartialQuantities] = useState<Record<string, number>>({});
  const [rejectReason, setRejectReason] = useState('');
  const [infoRequest, setInfoRequest] = useState('');
  const [forwardNotes, setForwardNotes] = useState('');

  const isAdmin = user?.role === 'hospital_admin';
  const isCMO = user?.role === 'cmo';

  // Fetch data using React Query hooks
  const { data: allRequests = [] } = useStockRequests();
  const { data: pendingRequests = [] } = usePendingStockRequests();
  const { data: urgentPendingRequests = [] } = useUrgentPendingStockRequests();

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const approvedToday = allRequests.filter(
      (req) =>
        (req.status === 'approved' || req.status === 'partially_approved') &&
        req.reviewedAt?.startsWith(today)
    ).length;

    return {
      pending: pendingRequests.length,
      urgent: urgentPendingRequests.length,
      approvedToday,
      total: allRequests.length,
    };
  }, [allRequests, pendingRequests, urgentPendingRequests]);

  // Filter requests
  const filterRequests = (requests: StockRequest[]) => {
    return requests.filter((req) => {
      if (urgencyFilter !== 'all' && req.urgency !== urgencyFilter) return false;
      if (roleFilter !== 'all' && req.requesterRole !== roleFilter) return false;
      return true;
    });
  };

  const filteredPendingRequests = useMemo(() => filterRequests(pendingRequests), [pendingRequests, urgencyFilter, roleFilter]);
  const filteredAllRequests = useMemo(() => filterRequests(allRequests), [allRequests, urgencyFilter, roleFilter]);

  // Action handlers
  const handleApprove = () => {
    if (!approveDialog.request || !user) return;

    updateStockRequestMutation.mutate({
      id: approveDialog.request.id,
      status: 'approved',
      notes: approveNotes || undefined
    });

    toast({
      title: 'Request Approved',
      description: `Stock request from ${approveDialog.request.requesterName} has been approved.`,
    });

    setApproveDialog({ open: false, request: null });
    setApproveNotes('');
  };

  const handlePartialApprove = () => {
    if (!partialApproveDialog.request || !user || !partialApproveNotes.trim()) {
      toast({
        variant: 'destructive',
        title: 'Notes Required',
        description: 'Please provide notes explaining the partial approval.',
      });
      return;
    }

    updateStockRequestMutation.mutate({
      id: partialApproveDialog.request.id,
      status: 'partially_approved',
      notes: partialApproveNotes
    });

    toast({
      title: 'Request Partially Approved',
      description: `Stock request from ${partialApproveDialog.request.requesterName} has been partially approved.`,
    });

    setPartialApproveDialog({ open: false, request: null });
    setPartialApproveNotes('');
    setPartialQuantities({});
  };

  const handleReject = () => {
    if (!rejectDialog.request || !user || !rejectReason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Reason Required',
        description: 'Please provide a reason for rejection.',
      });
      return;
    }

    updateStockRequestMutation.mutate({
      id: rejectDialog.request.id,
      status: 'rejected',
      notes: rejectReason
    });

    toast({
      title: 'Request Rejected',
      description: `Stock request from ${rejectDialog.request.requesterName} has been rejected.`,
    });

    setRejectDialog({ open: false, request: null });
    setRejectReason('');
  };

  const handleRequestInfo = () => {
    if (!infoDialog.request || !user || !infoRequest.trim()) {
      toast({
        variant: 'destructive',
        title: 'Message Required',
        description: 'Please provide a message requesting more information.',
      });
      return;
    }

    updateStockRequestMutation.mutate({
      id: infoDialog.request.id,
      status: 'info_requested',
      notes: infoRequest
    });

    toast({
      title: 'Information Requested',
      description: `Request sent to ${infoDialog.request.requesterName}.`,
    });

    setInfoDialog({ open: false, request: null });
    setInfoRequest('');
  };

  const handleForward = () => {
    if (!forwardDialog.request || !user) return;

    updateStockRequestMutation.mutate({
      id: forwardDialog.request.id,
      status: 'forwarded_to_cmo',
      notes: forwardNotes || undefined
    });

    toast({
      title: 'Request Forwarded',
      description: `Stock request has been forwarded to the CMO for review.`,
    });

    setForwardDialog({ open: false, request: null });
    setForwardNotes('');
  };

  // Helper functions
  const getStatusBadge = (status: StockRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">{status}</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'partially_approved':
        return <Badge variant="secondary">Partial Approval</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{status}</Badge>;
      case 'forwarded_to_cmo':
        return <Badge variant="outline">Forwarded to CMO</Badge>;
      case 'info_requested':
        return <Badge variant="outline" className="text-amber-600 border-amber-300">Info Requested</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: StockRequestUrgency) => {
    return urgency === 'urgent' ? (
      <Badge variant="destructive">Urgent</Badge>
    ) : (
      <Badge variant="outline">Normal</Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const displayRole = role.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return <Badge variant="outline">{displayRole}</Badge>;
  };

  const handleRowClick = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const openPartialApproveDialog = (request: StockRequest) => {
    const initialQuantities: Record<string, number> = {};
    request.items.forEach((item) => {
      initialQuantities[item.inventoryItemId] = item.requestedQuantity;
    });
    setPartialQuantities(initialQuantities);
    setPartialApproveDialog({ open: true, request });
  };

  // Render request table
  const renderRequestsTable = (requests: StockRequest[]) => {
    if (requests.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No stock requests found.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const isExpanded = expandedRequestId === request.id;

            return (
              <>
                <TableRow
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(request.id)}
                >
                  <TableCell>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{request.requesterName}</div>
                      {getRoleBadge(request.requesterRole)}
                    </div>
                  </TableCell>
                  <TableCell>{request.requesterDepartment}</TableCell>
                  <TableCell>{request.items.length} item(s)</TableCell>
                  <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {request.status === 'pending' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setApproveDialog({ open: true, request })}>
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openPartialApproveDialog(request)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Partial Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRejectDialog({ open: true, request })}>
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setInfoDialog({ open: true, request })}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Request Info
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setForwardDialog({ open: true, request })}>
                              <Forward className="mr-2 h-4 w-4" />
                              Forward to CMO
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {request.status !== 'pending' && isCMO && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 7} className="bg-muted/50">
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items Requested</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Requested Qty</TableHead>
                                <TableHead>Approved Qty</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {request.items.map((item) => (
                                <TableRow key={item.inventoryItemId}>
                                  <TableCell>{item.itemName}</TableCell>
                                  <TableCell>{item.currentStock}</TableCell>
                                  <TableCell>{item.requestedQuantity}</TableCell>
                                  <TableCell>
                                    {item.approvedQuantity !== undefined ? item.approvedQuantity : '—'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Reason</h4>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>

                        {request.notes && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Requester Notes</h4>
                              <p className="text-sm text-muted-foreground">{request.notes}</p>
                            </div>
                          </>
                        )}

                        {request.reviewerNotes && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Reviewer Notes</h4>
                              <p className="text-sm text-muted-foreground">{request.reviewerNotes}</p>
                              {request.reviewedByName && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Reviewed by {request.reviewedByName}
                                  {request.reviewedAt && ` on ${format(new Date(request.reviewedAt), 'MMM dd, yyyy')}`}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <DashboardLayout allowedRoles={['hospital_admin', 'cmo']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Stock Requests</h1>
            {isCMO && <Badge variant="secondary">View Only</Badge>}
          </div>
          <p className="text-muted-foreground mt-1">
            Review and manage stock requests from all departments
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${stats.urgent > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.urgent > 0 ? 'text-destructive' : ''}`}>
                {stats.urgent}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter pending stock requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select
                      value={urgencyFilter}
                      onValueChange={(value) => setUrgencyFilter(value as 'all' | StockRequestUrgency)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Requester Role</Label>
                    <Select
                      value={roleFilter}
                      onValueChange={(value) => setRoleFilter(value as 'all' | UserRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="lab_technician">Lab Technician</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  {filteredPendingRequests.length} pending request(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderRequestsTable(filteredPendingRequests)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter all stock requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select
                      value={urgencyFilter}
                      onValueChange={(value) => setUrgencyFilter(value as 'all' | StockRequestUrgency)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Requester Role</Label>
                    <Select
                      value={roleFilter}
                      onValueChange={(value) => setRoleFilter(value as 'all' | UserRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="lab_technician">Lab Technician</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>
                  {filteredAllRequests.length} total request(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderRequestsTable(filteredAllRequests)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Approve Dialog */}
        <AlertDialog open={approveDialog.open} onOpenChange={(open) => !open && setApproveDialog({ open: false, request: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Stock Request</AlertDialogTitle>
              <AlertDialogDescription>
                {approveDialog.request && (
                  <>
                    <p>You are approving the stock request from <strong>{approveDialog.request.requesterName}</strong>.</p>
                    <p className="mt-2">Items: {approveDialog.request.items.length} item(s)</p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <Label htmlFor="approve-notes">Notes (optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes about this approval..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setApproveNotes('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove}>Approve Request</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Partial Approve Dialog */}
        <Dialog open={partialApproveDialog.open} onOpenChange={(open) => !open && setPartialApproveDialog({ open: false, request: null })}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partial Approval</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {partialApproveDialog.request && (
                <>
                  <div>
                    <h4 className="font-semibold mb-2">Adjust Approved Quantities</h4>
                    <div className="space-y-3">
                      {partialApproveDialog.request.items.map((item) => (
                        <div key={item.inventoryItemId} className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <p className="font-medium text-sm">{item.itemName}</p>
                            <p className="text-xs text-muted-foreground">Requested: {item.requestedQuantity}</p>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`qty-${item.inventoryItemId}`}>Approved Quantity</Label>
                            <Input
                              id={`qty-${item.inventoryItemId}`}
                              type="number"
                              min={0}
                              max={item.requestedQuantity}
                              value={partialQuantities[item.inventoryItemId] || 0}
                              onChange={(e) => setPartialQuantities({
                                ...partialQuantities,
                                [item.inventoryItemId]: parseInt(e.target.value) || 0
                              })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partial-notes">Notes (required) *</Label>
                    <Textarea
                      id="partial-notes"
                      placeholder="Explain what was partially approved and why..."
                      value={partialApproveNotes}
                      onChange={(e) => setPartialApproveNotes(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setPartialApproveDialog({ open: false, request: null });
                setPartialApproveNotes('');
                setPartialQuantities({});
              }}>
                Cancel
              </Button>
              <Button onClick={handlePartialApprove}>Submit Partial Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, request: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {rejectDialog.request && (
                <p className="text-sm text-muted-foreground">
                  You are rejecting the stock request from <strong>{rejectDialog.request.requesterName}</strong>.
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Rejection Reason (required) *</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Explain why this request is being rejected..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setRejectDialog({ open: false, request: null });
                setRejectReason('');
              }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>Reject Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Request Info Dialog */}
        <Dialog open={infoDialog.open} onOpenChange={(open) => !open && setInfoDialog({ open: false, request: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request More Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {infoDialog.request && (
                <p className="text-sm text-muted-foreground">
                  Send a message to <strong>{infoDialog.request.requesterName}</strong> requesting more information.
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="info-request">Your Message (required) *</Label>
                <Textarea
                  id="info-request"
                  placeholder="What additional information do you need?"
                  value={infoRequest}
                  onChange={(e) => setInfoRequest(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setInfoDialog({ open: false, request: null });
                setInfoRequest('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleRequestInfo}>Send Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Forward to CMO Dialog */}
        <AlertDialog open={forwardDialog.open} onOpenChange={(open) => !open && setForwardDialog({ open: false, request: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Forward to CMO</AlertDialogTitle>
              <AlertDialogDescription>
                Forward this request to the CMO for review?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <Label htmlFor="forward-notes">Notes (optional)</Label>
              <Textarea
                id="forward-notes"
                placeholder="Add any notes for the CMO..."
                value={forwardNotes}
                onChange={(e) => setForwardNotes(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setForwardNotes('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleForward}>Forward to CMO</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
