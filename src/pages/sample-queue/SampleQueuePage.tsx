// SampleQueuePage - Lab tech sample collection queue

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { RefreshCw, FlaskConical, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useToast } from '@/hooks/use-toast';
import { useLabOrders } from '@/hooks/queries/useLabQueries';
import { useUpdateLabOrderStatus } from '@/hooks/mutations/useLabMutations';
import { LabOrder, LabOrderStatus, LabPriority } from '@/types/clinical.types';
import { PAGINATION } from '@/constants/designSystem';

type StatusFilter = 'all' | 'ordered' | 'sample_collected';
type PriorityFilter = 'all' | 'stat' | 'urgent' | 'routine';

export default function SampleQueuePage() {
  const { toast } = useToast();
  const { data: mockLabOrders = [] } = useLabOrders();
  const updateLabOrderStatusMutation = useUpdateLabOrderStatus();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);

  // Get lab orders with status 'ordered' or 'sample_collected'
  const labOrders = useMemo((): LabOrder[] => {
    let filtered = mockLabOrders.filter(
      order => order.status === 'ordered' || order.status === 'sample_collected'
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.patientName.toLowerCase().includes(lowerSearch) ||
          order.patientMrn.toLowerCase().includes(lowerSearch) ||
          order.tests.some(test => test.testName.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort: STAT first, then by order time
    filtered.sort((a, b) => {
      if (a.priority === 'stat' && b.priority !== 'stat') return -1;
      if (b.priority === 'stat' && a.priority !== 'stat') return 1;
      return new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime();
    });

    return filtered;
  }, [mockLabOrders, searchTerm, statusFilter, priorityFilter, refreshKey]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allOrders = mockLabOrders.filter(
      order => order.status === 'ordered' || order.status === 'sample_collected'
    );
    return {
      awaitingCollection: allOrders.filter(order => order.status === 'ordered').length,
      samplesCollected: allOrders.filter(order => order.status === 'sample_collected').length,
      statOrders: allOrders.filter(order => order.priority === 'stat').length,
    };
  }, [mockLabOrders, refreshKey]);

  // Pagination
  const totalPages = Math.ceil(labOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = labOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleCollectSample = (order: LabOrder): void => {
    updateLabOrderStatusMutation.mutate({
      orderId: order.id,
      status: 'sample_collected'
    });
    setRefreshKey(k => k + 1);
    toast({
      title: 'Sample Collected',
      description: `Sample collected for ${order.patientName}`,
    });
  };

  const handleProcess = (order: LabOrder): void => {
    updateLabOrderStatusMutation.mutate({
      orderId: order.id,
      status: 'processing'
    });
    setRefreshKey(k => k + 1);
    toast({
      title: 'Processing Started',
      description: `Processing sample for ${order.patientName}`,
    });
  };

  const getPriorityBadge = (priority: LabPriority): JSX.Element => {
    switch (priority) {
      case 'stat':
        return <Badge variant="destructive">STAT</Badge>;
      case 'urgent':
        return <Badge variant="default" className="bg-orange-500">Urgent</Badge>;
      case 'routine':
        return <Badge variant="secondary">Routine</Badge>;
    }
  };

  const getStatusBadge = (status: LabOrderStatus): JSX.Element => {
    switch (status) {
      case 'ordered':
        return <Badge variant="outline">Ordered</Badge>;
      case 'sample_collected':
        return <Badge variant="default" className="bg-blue-500">Sample Collected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePageSizeChange = (size: number): void => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleRefresh = (): void => {
    setRefreshKey(k => k + 1);
    toast({
      title: 'Refreshed',
      description: 'Queue has been refreshed',
    });
  };

  return (
    <DashboardLayout allowedRoles={['lab_tech']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6" />
              Sample Collection Queue
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.awaitingCollection}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Samples Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.samplesCollected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                STAT Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.statOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patient, MRN, or test..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={priorityFilter}
                onValueChange={(value: PriorityFilter) => {
                  setPriorityFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value: StatusFilter) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="sample_collected">Sample Collected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Ordered By</TableHead>
                    <TableHead>Order Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.patientName}</TableCell>
                        <TableCell>{order.patientMrn}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.tests.map((test, idx) => (
                              <span key={idx} className="text-sm">
                                {test.testName}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell className="text-sm">{order.doctorName}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(order.orderedAt), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {order.status === 'ordered' && (
                              <Button
                                size="sm"
                                onClick={() => handleCollectSample(order)}
                              >
                                Collect Sample
                              </Button>
                            )}
                            {order.status === 'sample_collected' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleProcess(order)}
                              >
                                Process
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {labOrders.length > 0 && (
              <div className="mt-4">
                <QueuePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={labOrders.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
