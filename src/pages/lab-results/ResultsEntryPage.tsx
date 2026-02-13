// ResultsEntryPage - Lab tech results entry page

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RefreshCw, Microscope, Search, ClipboardCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useToast } from '@/hooks/use-toast';
import { mockLabOrders, updateLabOrderStatus, getTestCatalogEntry } from '@/data/lab-orders';
import { LabOrder, LabPriority } from '@/types/clinical.types';
import { MetadataEditor } from '@/components/molecules/lab/MetadataEditor';
import { PAGINATION } from '@/constants/designSystem';

type StatusFilter = 'all' | 'processing' | 'sample_collected';
type PriorityFilter = 'all' | 'stat' | 'urgent' | 'routine';

interface TestResult {
  result: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
  techNotes: string;
  metadata: Record<string, string>;
}

export default function ResultsEntryPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [resultsData, setResultsData] = useState<Record<string, TestResult>>({});

  // Get lab orders with status 'processing' or 'sample_collected'
  const labOrders = useMemo(() => {
    let filtered = mockLabOrders.filter(
      order => order.status === 'processing' || order.status === 'sample_collected'
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
  }, [searchTerm, statusFilter, priorityFilter, refreshKey]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allOrders = mockLabOrders.filter(
      order => order.status === 'processing' || order.status === 'sample_collected'
    );
    return {
      awaitingResults: allOrders.filter(order => order.status === 'sample_collected').length,
      inProcessing: allOrders.filter(order => order.status === 'processing').length,
    };
  }, [refreshKey]);

  // Completed results pending submission to doctor
  const pendingSubmission = useMemo(() => {
    return mockLabOrders.filter(
      order => order.status === 'completed' && !order.isSubmittedToDoctor
    );
  }, [refreshKey]);

  // Pagination
  const totalPages = Math.ceil(labOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = labOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenResultsDialog = (order: LabOrder) => {
    setSelectedOrder(order);

    // Initialize results data with existing results, falling back to catalog defaults
    const initialData: Record<string, TestResult> = {};
    order.tests.forEach(test => {
      const catalogEntry = getTestCatalogEntry(test.testCode);
      const existingMetadata: Record<string, string> = {};
      if (test.metadata) {
        Object.entries(test.metadata).forEach(([k, v]) => {
          if (typeof v === 'string') existingMetadata[k] = v;
        });
      }
      initialData[test.testCode] = {
        result: test.result || '',
        unit: test.unit || catalogEntry?.defaultUnit || '',
        normalRange: test.normalRange || catalogEntry?.defaultRange || '',
        isAbnormal: test.isAbnormal || false,
        techNotes: test.techNotes || '',
        metadata: existingMetadata,
      };
    });
    setResultsData(initialData);
    setResultsDialogOpen(true);
  };

  const handleResultChange = (testCode: string, field: keyof TestResult, value: string | boolean) => {
    setResultsData(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        [field]: value,
      },
    }));
  };

  const handleMetadataChange = (testCode: string, metadata: Record<string, string>) => {
    setResultsData(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        metadata,
      },
    }));
  };

  const handleSubmitResults = () => {
    if (!selectedOrder) return;

    // Update the order's tests with the results
    selectedOrder.tests.forEach(test => {
      const resultData = resultsData[test.testCode];
      if (resultData) {
        test.result = resultData.result;
        test.unit = resultData.unit;
        test.normalRange = resultData.normalRange;
        test.isAbnormal = resultData.isAbnormal;
        test.techNotes = resultData.techNotes;
        test.metadata = { ...test.metadata, ...resultData.metadata };
      }
    });

    updateLabOrderStatus(selectedOrder.id, 'completed');
    selectedOrder.isSubmittedToDoctor = false;
    setRefreshKey(k => k + 1);
    setResultsDialogOpen(false);
    setSelectedOrder(null);

    toast({
      title: 'Results Submitted',
      description: `Results submitted for ${selectedOrder.patientName}`,
    });
  };

  const getPriorityBadge = (priority: LabPriority) => {
    switch (priority) {
      case 'stat':
        return <Badge variant="destructive">STAT</Badge>;
      case 'urgent':
        return <Badge variant="default" className="bg-orange-500">Urgent</Badge>;
      case 'routine':
        return <Badge variant="secondary">Routine</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sample_collected':
        return <Badge variant="outline" className="bg-blue-50">Sample Collected</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-purple-500">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
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
              <Microscope className="h-6 w-6" />
              Results Entry
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.awaitingResults}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.inProcessing}</div>
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
                  <SelectItem value="sample_collected">Sample Collected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
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
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
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
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenResultsDialog(order)}
                          >
                            Enter Results
                          </Button>
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

      {/* Pending Submission Section */}
      {pendingSubmission.length > 0 && (
        <div className="px-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="h-5 w-5 text-amber-500" />
                Completed Results — Pending Submission ({pendingSubmission.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSubmission.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.patientName}</TableCell>
                        <TableCell>{order.patientMrn}</TableCell>
                        <TableCell>
                          {order.tests.map(t => t.testName).join(', ')}
                        </TableCell>
                        <TableCell>
                          {order.completedAt && format(new Date(order.completedAt), 'MMM dd, HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/lab-tech/results/${order.id}`)}
                          >
                            Review & Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Entry Dialog */}
      <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enter Lab Results</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <>
                  Patient: {selectedOrder.patientName} ({selectedOrder.patientMrn})
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {selectedOrder.tests.map((test, idx) => {
                const testCode = test.testCode;
                const catalogEntry = getTestCatalogEntry(testCode);
                const resultData = resultsData[testCode] || {
                  result: '',
                  unit: '',
                  normalRange: '',
                  isAbnormal: false,
                };

                return (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-base">{test.testName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`result-${testCode}`}>Result Value</Label>
                          <Input
                            id={`result-${testCode}`}
                            placeholder="Enter result"
                            value={resultData.result}
                            onChange={(e) =>
                              handleResultChange(testCode, 'result', e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`unit-${testCode}`}>Unit</Label>
                          <Input
                            id={`unit-${testCode}`}
                            placeholder="e.g., mg/dL, mmol/L"
                            value={resultData.unit}
                            onChange={(e) =>
                              handleResultChange(testCode, 'unit', e.target.value)
                            }
                          />
                          {catalogEntry && resultData.unit === catalogEntry.defaultUnit && (
                            <p className="text-xs text-muted-foreground">Auto-filled from test catalog</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`range-${testCode}`}>Reference Range</Label>
                        <Input
                          id={`range-${testCode}`}
                          placeholder="e.g., 70-100 mg/dL"
                          value={resultData.normalRange}
                          onChange={(e) =>
                            handleResultChange(testCode, 'normalRange', e.target.value)
                          }
                        />
                        {catalogEntry && resultData.normalRange === catalogEntry.defaultRange && (
                          <p className="text-xs text-muted-foreground">Auto-filled from test catalog</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`abnormal-${testCode}`}
                          checked={resultData.isAbnormal}
                          onCheckedChange={(checked) =>
                            handleResultChange(testCode, 'isAbnormal', checked === true)
                          }
                        />
                        <Label
                          htmlFor={`abnormal-${testCode}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as abnormal
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${testCode}`}>Tech Notes</Label>
                        <Textarea
                          id={`notes-${testCode}`}
                          placeholder="Add technical notes (methodology, observations, etc.)"
                          value={resultData.techNotes}
                          onChange={(e) =>
                            handleResultChange(testCode, 'techNotes', e.target.value)
                          }
                          rows={2}
                        />
                      </div>

                      <MetadataEditor
                        metadata={resultData.metadata || {}}
                        onChange={(metadata) => handleMetadataChange(testCode, metadata)}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResultsDialogOpen(false);
                setSelectedOrder(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitResults}>
              Submit Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
