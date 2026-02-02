// CMO Dashboard - Executive Overview

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Settings,
  DollarSign,
  Clock,
  UserCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { usePermissionContext } from '@/contexts/PermissionContext';
import { Link } from 'react-router-dom';

export default function CMODashboard() {
  const { toggles } = usePermissionContext();

  return (
    <DashboardLayout allowedRoles={['cmo']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">CMO Dashboard</h1>
            <p className="text-muted-foreground">Executive overview of LifeCare Clinic</p>
          </div>
          <Link to="/cmo/settings/permissions">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Permission Settings
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Today's Patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦1.2M</p>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
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
              <p className="text-xs text-muted-foreground">-5 min from avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Staff on Duty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">3 doctors, 4 nurses</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Clinical Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Clinical Summary
              </CardTitle>
              <CardDescription>Patient care overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">In Consultation</span>
                <Badge>5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Triage Queue</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Lab Results</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-destructive">Critical Cases</span>
                <Badge variant="destructive">2</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Financial Summary
              </CardTitle>
              <CardDescription>Revenue and collections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash Collected</span>
                <span className="font-medium">₦850,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">HMO Receivables</span>
                <span className="font-medium">₦1,250,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Bills</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Claims</span>
                <Badge variant="outline">15</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                System Alerts
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">Low Stock: Medical Oxygen</p>
                <p className="text-xs text-muted-foreground">5 cylinders remaining (min: 8)</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning">Low Stock: Diesel</p>
                <p className="text-xs text-muted-foreground">150L remaining (min: 200L)</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium">3 HMO Claims Denied</p>
                <p className="text-xs text-muted-foreground">Review and resubmit required</p>
              </div>
            </CardContent>
          </Card>

          {/* Permission Toggles Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Access Control Status
              </CardTitle>
              <CardDescription>Current permission toggles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Hospital Admin Clinical Access</p>
                  <p className="text-xs text-muted-foreground">View patient records</p>
                </div>
                <Badge variant={toggles.hospitalAdminClinicalAccess ? 'default' : 'secondary'}>
                  {toggles.hospitalAdminClinicalAccess ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Clinical Lead Financial Access</p>
                  <p className="text-xs text-muted-foreground">View revenue reports</p>
                </div>
                <Badge variant={toggles.clinicalLeadFinancialAccess ? 'default' : 'secondary'}>
                  {toggles.clinicalLeadFinancialAccess ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <Link to="/cmo/settings/permissions" className="block">
                <Button variant="outline" className="w-full mt-2">
                  Manage Permissions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Infrastructure and connectivity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Wifi className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Internet</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <WifiOff className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Lab Integration</p>
                  <p className="text-xs text-muted-foreground">Partial</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Pharmacy Sync</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
