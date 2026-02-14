// Clinical Lead Dashboard - Medical Quality & Staff

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock,
  AlertTriangle,
  Users,
  TestTube,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { getMedicalStaff, getDoctors, getNurses } from '@/data/staff';
import { getLabResultsForReview, getUrgentLabOrders } from '@/data/lab-orders';
import { getQueueByType, getWaitingCount } from '@/data/queue';

export default function ClinicalLeadDashboard() {
  const { user } = useAuth();
  const { canViewFinancialData } = usePermissions({ userRole: user?.role });

  const medicalStaff = getMedicalStaff();
  const doctors = getDoctors();
  const nurses = getNurses();
  const labResultsForReview = getLabResultsForReview();
  const urgentLabOrders = getUrgentLabOrders();
  const triageQueue = getQueueByType('triage');
  const doctorQueue = getQueueByType('doctor');

  return (
    <DashboardLayout allowedRoles={['clinical_lead']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Clinical Lead Dashboard</h1>
          <p className="text-muted-foreground">Medical quality and staff performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients Today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-green-600">8 consultations ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Wait Time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18 min</p>
              <p className="text-xs text-muted-foreground">Target: 20 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctors On Duty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{doctors.filter(d => d.isOnDuty).length}</p>
              <p className="text-xs text-muted-foreground">of {doctors.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Nurses On Duty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{nurses.filter(n => n.isOnDuty).length}</p>
              <p className="text-xs text-muted-foreground">of {nurses.length} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Queue Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Queue Status
              </CardTitle>
              <CardDescription>Current patient queues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">Triage Queue</p>
                  <p className="text-xs text-muted-foreground">
                    {triageQueue.filter(q => q.priority === 'high').length} high priority
                  </p>
                </div>
                <Badge variant={getWaitingCount('triage') > 5 ? 'destructive' : 'secondary'}>
                  {getWaitingCount('triage')} waiting
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">Doctor Queue</p>
                  <p className="text-xs text-muted-foreground">
                    {doctorQueue.filter(q => q.status === 'in_progress').length} in consultation
                  </p>
                </div>
                <Badge variant={getWaitingCount('doctor') > 5 ? 'destructive' : 'secondary'}>
                  {getWaitingCount('doctor')} waiting
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">Lab Queue</p>
                  <p className="text-xs text-muted-foreground">Sample collection</p>
                </div>
                <Badge variant="secondary">{getWaitingCount('lab')} waiting</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Critical Cases & Lab Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Requiring Attention
              </CardTitle>
              <CardDescription>Critical cases and abnormal results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentLabOrders.length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">
                    {urgentLabOrders.length} Urgent Lab Order{urgentLabOrders.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">STAT priority pending</p>
                </div>
              )}
              {labResultsForReview.map((order) => (
                <div key={order.id} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm font-medium">{order.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    Abnormal results: {order.tests.filter(t => t.isAbnormal).map(t => t.testName).join(', ')}
                  </p>
                </div>
              ))}
              {urgentLabOrders.length === 0 && labResultsForReview.length === 0 && (
                <p className="text-sm text-muted-foreground">No critical items at this time</p>
              )}
            </CardContent>
          </Card>

          {/* Medical Staff Roster */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Medical Staff Roster
              </CardTitle>
              <CardDescription>Doctors and nurses on duty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicalStaff.filter(s => s.isOnDuty).map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {staff.role} • {staff.specialization || staff.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">On Duty</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {staff.shiftStart} - {staff.shiftEnd}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conditional Financial Access */}
          {canViewFinancialData && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <Badge variant="outline" className="text-xs">Extended Access</Badge>
                </CardTitle>
                <CardDescription>Financial overview (read-only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Today's Revenue</span>
                  <span className="font-medium">₦1,200,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Month-to-Date</span>
                  <span className="font-medium">₦28,500,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">HMO Receivables</span>
                  <span className="font-medium">₦4,250,000</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This access was granted by the CMO
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
