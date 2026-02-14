// CMO Permission Settings Page

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  Eye,
  DollarSign,
} from 'lucide-react';
import { usePermissionToggles } from '@/hooks/queries/usePermissionQueries';
import { useSetPermissionToggle } from '@/hooks/mutations/usePermissionMutations';

export default function PermissionSettings() {
  const { data: toggles } = usePermissionToggles();
  const setToggleMutation = useSetPermissionToggle();

  const safeToggles = toggles ?? {
    hospitalAdminClinicalAccess: false,
    clinicalLeadFinancialAccess: false,
  };

  const setToggle = (key: 'hospitalAdminClinicalAccess' | 'clinicalLeadFinancialAccess', value: boolean) => {
    setToggleMutation.mutate({ key, value });
  };

  return (
    <DashboardLayout allowedRoles={['cmo']}>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Permission Settings</h1>
          <p className="text-muted-foreground">Manage cross-domain access for administrative roles</p>
        </div>

        {/* Warning */}
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sensitive Settings</AlertTitle>
          <AlertDescription>
            These toggles grant extended access to sensitive data. Changes take effect immediately.
            Only the CMO can modify these settings.
          </AlertDescription>
        </Alert>

        {/* Hospital Administrator Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Hospital Administrator
            </CardTitle>
            <CardDescription>
              Grant clinical data access to the Hospital Administrator role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="clinical-access" className="font-medium">
                  Clinical Records Access
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow Hospital Administrator to view patient records, EMRs, and clinical notes (read-only)
                </p>
              </div>
              <Switch
                id="clinical-access"
                checked={safeToggles.hospitalAdminClinicalAccess}
                onCheckedChange={(checked) => setToggle('hospitalAdminClinicalAccess', checked)}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Current Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={safeToggles.hospitalAdminClinicalAccess ? 'default' : 'secondary'}>
                  {safeToggles.hospitalAdminClinicalAccess ? 'Enabled' : 'Disabled'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {safeToggles.hospitalAdminClinicalAccess
                    ? 'Hospital Admin can view clinical data'
                    : 'Hospital Admin has no clinical access'}
                </span>
              </div>
            </div>

            {safeToggles.hospitalAdminClinicalAccess && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning font-medium">Access Granted</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hospital Administrator can now view: Patient records, Consultation notes,
                  Lab results (read-only), Prescription history (read-only)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clinical Lead Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Clinical Lead
            </CardTitle>
            <CardDescription>
              Grant financial data access to the Clinical Lead role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="financial-access" className="font-medium">
                  Financial Transparency
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow Clinical Lead to view revenue reports, profit margins, and financial analytics (read-only)
                </p>
              </div>
              <Switch
                id="financial-access"
                checked={safeToggles.clinicalLeadFinancialAccess}
                onCheckedChange={(checked) => setToggle('clinicalLeadFinancialAccess', checked)}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Current Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={safeToggles.clinicalLeadFinancialAccess ? 'default' : 'secondary'}>
                  {safeToggles.clinicalLeadFinancialAccess ? 'Enabled' : 'Disabled'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {safeToggles.clinicalLeadFinancialAccess
                    ? 'Clinical Lead can view financial data'
                    : 'Clinical Lead has no financial access'}
                </span>
              </div>
            </div>

            {safeToggles.clinicalLeadFinancialAccess && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning font-medium">Access Granted</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clinical Lead can now view: Daily/Monthly revenue, Expense reports,
                  Profit margins, Financial analytics dashboards
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>All access is read-only - extended permissions do not grant edit capabilities</li>
              <li>Access changes are logged for audit purposes</li>
              <li>These settings only affect the Hospital Administrator and Clinical Lead roles</li>
              <li>CMO maintains full access to all data at all times</li>
              <li>In production, these settings would be stored securely in the database</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
