import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Package, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { useStockRequests } from '@/hooks/queries/useInventoryQueries';
import type { StockRequestStatus, StockRequestUrgency, StockRequest } from '@/types/stock-request.types';

function getRolePrefix(role: string): string {
  if (role === 'hospital_admin') return '/hospital-admin';
  if (role === 'clinical_lead') return '/clinical-lead';
  if (role === 'lab_tech') return '/lab-tech';
  return `/${role}`;
}

export default function StockRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: allStockRequests = [] } = useStockRequests();
  const [refreshKey] = useState(0);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const rolePrefix = user ? getRolePrefix(user.role) : '';

  // Fetch requests data
  const requests = useMemo(() => {
    if (!user?.id) return [];
    return (allStockRequests as StockRequest[]).filter((r) => r.requesterId === user.id);
  }, [user?.id, refreshKey, allStockRequests]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved' || r.status === 'partially_approved').length;
    return { pending, approved, total: requests.length };
  }, [requests]);

  const getStatusBadge = (status: StockRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">{status}</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">approved</Badge>;
      case 'partially_approved':
        return <Badge variant="secondary">partially approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">rejected</Badge>;
      case 'forwarded_to_cmo':
        return <Badge variant="outline">forwarded to CMO</Badge>;
      case 'info_requested':
        return <Badge variant="outline" className="text-amber-600 border-amber-300">info requested</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-500 hover:bg-green-600">fulfilled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: StockRequestUrgency) => {
    return urgency === 'urgent'
      ? <Badge variant="destructive">Urgent</Badge>
      : <Badge variant="secondary">Normal</Badge>;
  };

  const toggleExpandRequest = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  return (
    <DashboardLayout allowedRoles={['pharmacist', 'lab_tech', 'nurse', 'doctor', 'receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stock Requests</h1>
            <p className="text-muted-foreground">Request supplies for your department</p>
          </div>
          <Button onClick={() => navigate(`${rolePrefix}/stock-requests/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
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

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
            <CardDescription>View and track your stock requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No stock requests yet. Click 'New Request' to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Reviewer Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <>
                        <TableRow
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleExpandRequest(request.id)}
                        >
                          <TableCell>
                            {expandedRequestId === request.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{request.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{request.items.length}</Badge>
                              <span className="text-sm">{request.items[0]?.itemName}</span>
                              {request.items.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  +{request.items.length - 1} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{format(new Date(request.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                          <TableCell>
                            {request.reviewerNotes ? (
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {request.reviewerNotes}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>

                        {expandedRequestId === request.id && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/20">
                              <div className="p-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Requested Items</h4>
                                  <div className="space-y-2">
                                    {request.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                                        <div className="flex-1">
                                          <p className="font-medium">{item.itemName}</p>
                                          <p className="text-muted-foreground text-xs">
                                            Current stock: {item.currentStock}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span>Requested: <strong>{item.requestedQuantity}</strong></span>
                                          {item.approvedQuantity !== undefined && (
                                            <span>Approved: <strong>{item.approvedQuantity}</strong></span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-1">Reason</h4>
                                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                                </div>

                                {request.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-1">Additional Notes</h4>
                                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                                  </div>
                                )}

                                {request.reviewerNotes && (
                                  <div>
                                    <h4 className="font-semibold mb-1">Reviewer Response</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                      <p className="text-sm">{request.reviewerNotes}</p>
                                      {request.reviewedByName && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                          By {request.reviewedByName} on{' '}
                                          {request.reviewedAt && format(new Date(request.reviewedAt), 'MMM d, yyyy HH:mm')}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
