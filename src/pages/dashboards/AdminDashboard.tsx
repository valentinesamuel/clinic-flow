import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  UserPlus,
  FileText,
  Calendar,
  DollarSign,
  Activity,
} from 'lucide-react';

// Mock data for KPIs
const revenueData = {
  today: 485000,
  week: 2847000,
  month: 11234000,
  trend: 12.5,
};

const staffData = {
  onDuty: 18,
  absent: 2,
  shiftEnding: 3,
};

const patientData = {
  todayVisits: 47,
  avgWaitTime: 24,
  queueLength: 12,
};

const alerts = [
  { id: 1, type: 'warning', message: 'Low stock: Paracetamol (50 units remaining)' },
  { id: 2, type: 'error', message: '3 HMO claims overdue (>30 days)' },
  { id: 3, type: 'info', message: '2 pending staff leave requests' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboard() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Administrator</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Revenue</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(revenueData.today)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-success">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{revenueData.trend}% from yesterday</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(revenueData.week)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>On track for monthly target</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(revenueData.month)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-success">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8.2% vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff & Patient Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Staff On Duty</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData.onDuty}</div>
              <p className="text-xs text-muted-foreground">
                {staffData.shiftEnding} shifts ending in 2 hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Today's Visits</CardDescription>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientData.todayVisits}</div>
              <p className="text-xs text-muted-foreground">
                {patientData.queueLength} currently in queue
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Avg Wait Time</CardDescription>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientData.avgWaitTime} min</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>+5 min from target</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Staff Absent</CardDescription>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData.absent}</div>
              <p className="text-xs text-muted-foreground">
                1 nurse, 1 receptionist
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.type === 'error'
                        ? 'text-destructive'
                        : alert.type === 'warning'
                        ? 'text-warning'
                        : 'text-primary'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col">
                <UserPlus className="h-5 w-5 mb-2" />
                <span className="text-xs">Add Patient</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <FileText className="h-5 w-5 mb-2" />
                <span className="text-xs">View Reports</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-xs">Staff Schedule</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="text-xs">Revenue Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
