// Lab Technician Dashboard - Hybrid Module with Coming Soon indicators

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  TestTube,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Info,
  Receipt,
  ChevronRight,
} from 'lucide-react';
import { getPendingLabOrders, getLabOrdersByStatus, getUrgentLabOrders } from '@/data/lab-orders';
import { getPendingBillsByDepartment } from '@/data/bills';

export default function LabTechDashboard() {
  const navigate = useNavigate();
  const pendingOrders = getPendingLabOrders();
  const orderedTests = getLabOrdersByStatus('ordered');
  const sampleCollected = getLabOrdersByStatus('sample_collected');
  const processing = getLabOrdersByStatus('processing');
  const urgentOrders = getUrgentLabOrders();
  const pendingLabBills = getPendingBillsByDepartment('lab');

  return (
    <DashboardLayout allowedRoles={['lab_tech']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Laboratory Dashboard</h1>
          <p className="text-muted-foreground">Sample processing and results management</p>
        </div>

        {/* Coming Soon Banner */}
        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertTitle>Hybrid Module</AlertTitle>
          <AlertDescription>
            External lab integration coming soon. Sample queue and results display are functional with mock data.
            Partner lab sync and equipment status will be enabled in the next phase.
          </AlertDescription>
        </Alert>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orderedTests.length}</p>
              <p className="text-xs text-muted-foreground">Awaiting collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Samples Collected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sampleCollected.length}</p>
              <p className="text-xs text-muted-foreground">Ready for processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{processing.length}</p>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgent (STAT)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{urgentOrders.length}</p>
              <p className="text-xs text-muted-foreground">Priority orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Billing Quick Access */}
        <Card 
          className="border-primary/30 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/lab-tech/billing')}
        >
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Laboratory Billing</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingLabBills.length} pending bills
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/lab-tech/billing'); }}>
                  Manage Bills
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sample Queue - Functional with mock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary" />
                Sample Queue
              </CardTitle>
              <CardDescription>Pending sample collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderedTests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending samples
                </p>
              ) : (
                orderedTests.map((order) => (
                  <div 
                    key={order.id} 
                    className={`p-3 rounded-lg ${
                      order.priority === 'stat' 
                        ? 'bg-destructive/10 border border-destructive/20' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{order.patientName}</p>
                        <p className="text-xs text-muted-foreground">MRN: {order.patientMrn}</p>
                      </div>
                      <Badge variant={order.priority === 'stat' ? 'destructive' : 'secondary'}>
                        {order.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tests: {order.tests.map(t => t.testName).join(', ')}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending Results - Functional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Processing Queue
              </CardTitle>
              <CardDescription>Samples being analyzed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...sampleCollected, ...processing].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No samples in processing
                </p>
              ) : (
                [...sampleCollected, ...processing].map((order) => (
                  <div key={order.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{order.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.tests.map(t => t.testName).join(', ')}
                        </p>
                      </div>
                      <Badge variant={order.status === 'processing' ? 'default' : 'secondary'}>
                        {order.status === 'processing' ? 'Processing' : 'Collected'}
                      </Badge>
                    </div>
                    {order.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{order.notes}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Equipment Status - Coming Soon */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center p-4">
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
                <p className="text-sm text-muted-foreground">
                  Equipment monitoring will be enabled with hardware integration
                </p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Lab equipment monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hematology Analyzer</span>
                  <Badge variant="default">Online</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Chemistry Analyzer</span>
                  <Badge variant="default">Online</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">X-Ray Machine</span>
                  <Badge variant="secondary">Maintenance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Lab Sync - Coming Soon */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center p-4">
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
                <p className="text-sm text-muted-foreground">
                  Partner lab integration for outsourced tests coming in next phase
                </p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Partner Lab Sync</CardTitle>
              <CardDescription>External lab integration status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between items-center">
                  <span className="text-sm">PathCare Nigeria</span>
                  <Badge variant="outline">Disconnected</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Synlab Nigeria</span>
                  <Badge variant="outline">Disconnected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
