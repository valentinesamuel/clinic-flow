import { useState, useMemo } from 'react';
import { FileText, Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLabOrdersByPatient } from '@/data/lab-orders';
import { useAuth } from '@/hooks/useAuth';

const PatientLabResultsPage = () => {
  const { user } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // For demo purposes, use hardcoded patient ID
  const patientId = 'pat-001';

  const labOrders = useMemo(() => {
    const orders = getLabOrdersByPatient(patientId);
    return orders.filter(order => order.status === 'completed');
  }, [patientId]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const hasAbnormalResults = (orderId: string) => {
    const order = labOrders.find(o => o.id === orderId);
    return order?.tests.some(test => test.isAbnormal) ?? false;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Lab Results</h1>
          <p className="text-muted-foreground">View your completed laboratory test results</p>
        </div>

        {labOrders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No lab results available</p>
              <p className="text-sm text-muted-foreground">
                Your completed test results will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {labOrders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const hasAbnormal = hasAbnormalResults(order.id);

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpand(order.id)}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Lab Order #{order.id}
                          {hasAbnormal && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {order.completedAt && format(new Date(order.completedAt), 'MMM dd, yyyy')}
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            {order.status === 'completed' ? 'Completed' : order.status}
                          </Badge>
                          <Badge variant={order.priority === 'urgent' ? 'destructive' : 'outline'}>
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ordered by: {order.doctorName}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-semibold">Test Results</h3>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Test Name</TableHead>
                                  <TableHead>Result</TableHead>
                                  <TableHead>Normal Range</TableHead>
                                  <TableHead>Unit</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.tests.map((test, index) => (
                                  <TableRow key={`${order.id}-${test.testCode}-${index}`}>
                                    <TableCell className="font-medium">
                                      {test.testName}
                                      <div className="text-xs text-muted-foreground">
                                        {test.testCode}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className={test.isAbnormal ? 'font-semibold text-red-600' : ''}>
                                        {test.result || 'N/A'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {test.normalRange || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {test.unit || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                      {test.isAbnormal ? (
                                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                                          Abnormal
                                        </Badge>
                                      ) : (
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                          Normal
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        {hasAbnormal && (
                          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                              <div>
                                <h4 className="font-semibold text-red-900">Abnormal Results Detected</h4>
                                <p className="text-sm text-red-700">
                                  Some of your test results fall outside the normal range. Please consult
                                  with your doctor for proper interpretation and follow-up care.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {order.notes && (
                          <div className="rounded-lg border bg-muted/50 p-4">
                            <h4 className="mb-1 font-semibold">Doctor's Notes</h4>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Ordered Date</p>
                            <p className="font-medium">
                              {format(new Date(order.orderedAt), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          {order.collectedAt && (
                            <div>
                              <p className="text-sm text-muted-foreground">Sample Collected</p>
                              <p className="font-medium">
                                {format(new Date(order.collectedAt), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          )}
                          {order.completedAt && (
                            <div>
                              <p className="text-sm text-muted-foreground">Completed</p>
                              <p className="font-medium">
                                {format(new Date(order.completedAt), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientLabResultsPage;
