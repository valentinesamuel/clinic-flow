import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLabOrders } from '@/hooks/queries/useLabQueries';
import { LabOrder } from '@/types/clinical.types';
import { format } from 'date-fns';
import { Search, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function LabResultsListPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: allLabOrders = [] } = useLabOrders();

  const basePath = user
    ? user.role === 'hospital_admin'
      ? '/hospital-admin'
      : user.role === 'clinical_lead'
      ? '/clinical-lead'
      : user.role === 'cmo'
      ? '/cmo'
      : `/${user.role}`
    : '';
  const [searchQuery, setSearchQuery] = useState('');
  const [showAbnormalOnly, setShowAbnormalOnly] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const completedOrders = useMemo((): LabOrder[] => {
    return allLabOrders.filter(o => o.status === 'completed');
  }, [allLabOrders]);

  const filteredOrders = useMemo((): LabOrder[] => {
    let filtered = [...completedOrders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.patientName.toLowerCase().includes(query) ||
        order.patientMrn.toLowerCase().includes(query) ||
        order.tests.some(test => test.testName.toLowerCase().includes(query))
      );
    }

    if (showAbnormalOnly) {
      filtered = filtered.filter(order =>
        order.tests.some(test => test.isAbnormal)
      );
    }

    return filtered;
  }, [completedOrders, searchQuery, showAbnormalOnly]);

  const stats = useMemo(() => {
    const totalResults = completedOrders.length;
    const abnormalResults = completedOrders.filter(order =>
      order.tests.some(test => test.isAbnormal)
    ).length;
    const pendingReview = completedOrders.filter(order =>
      order.tests.some(test => test.isAbnormal)
    ).length;

    return { totalResults, abnormalResults, pendingReview };
  }, [completedOrders]);

  const hasAbnormalResults = (order: LabOrder): boolean => {
    return order.tests.some(test => test.isAbnormal);
  };

  const toggleExpand = (orderId: string): void => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <DashboardLayout allowedRoles={['doctor', 'clinical_lead', 'cmo', 'hospital_admin', 'cashier', 'receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Lab Results</h1>
          <p className="text-muted-foreground mt-2">
            View and review completed lab test results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.totalResults}</div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Abnormal Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.abnormalResults}</div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.pendingReview}</div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Lab Results List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, MRN, or test name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showAbnormalOnly ? 'default' : 'outline'}
                  onClick={() => setShowAbnormalOnly(!showAbnormalOnly)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Abnormal Only
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Filter
                </Button>
              </div>
            </div>

            {/* Results Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date Completed</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <>
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleExpand(order.id)}
                        >
                          <TableCell className="font-medium">
                            {order.patientName}
                          </TableCell>
                          <TableCell>{order.patientMrn}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {order.tests.length} test{order.tests.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {order.tests[0]?.testName}
                                {order.tests.length > 1 && ` +${order.tests.length - 1} more`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{order.doctorName}</TableCell>
                          <TableCell>
                            {order.completedAt && format(new Date(order.completedAt), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {hasAbnormalResults(order) ? (
                              <Badge variant="destructive">Abnormal</Badge>
                            ) : (
                              <Badge className="bg-green-500 hover:bg-green-600">Normal</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {expandedOrderId === order.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row - Test Details */}
                        {expandedOrderId === order.id && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/30">
                              <div className="py-4 px-6 space-y-4">
                                <h4 className="font-semibold text-lg mb-3">Test Results</h4>
                                <div className="grid gap-3">
                                  {order.tests.map((test, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-4 rounded-lg border ${
                                        test.isAbnormal
                                          ? 'bg-red-50 border-red-200'
                                          : 'bg-white border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <h5 className="font-semibold">
                                              {test.testName}
                                            </h5>
                                            {test.isAbnormal && (
                                              <Badge variant="destructive" className="text-xs">
                                                Abnormal
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                            <div>
                                              <span className="text-muted-foreground">Result: </span>
                                              <span className={`font-medium ${test.isAbnormal ? 'text-red-600' : ''}`}>
                                                {test.result || 'Pending'}
                                              </span>
                                            </div>
                                            {test.normalRange && (
                                              <div>
                                                <span className="text-muted-foreground">Normal Range: </span>
                                                <span className="font-medium">{test.normalRange}</span>
                                              </div>
                                            )}
                                            {test.unit && (
                                              <div>
                                                <span className="text-muted-foreground">Unit: </span>
                                                <span className="font-medium">{test.unit}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {test.isAbnormal && (
                                          <AlertTriangle className="h-5 w-5 text-red-500 ml-2" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {order.notes && (
                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm">
                                      <span className="font-semibold">Notes: </span>
                                      {order.notes}
                                    </p>
                                  </div>
                                )}
                                <div className="mt-4 flex justify-end">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`${basePath}/lab-results/${order.id}`);
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Full Details
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {completedOrders.length} results
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
