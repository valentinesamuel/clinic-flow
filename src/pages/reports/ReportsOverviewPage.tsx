import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { roleMetadata } from '@/types/user.types';
import {
  BarChart3,
  FileText,
  Stethoscope,
  FlaskConical,
  Pill,
  Heart,
  ScanLine,
  Scissors,
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  route: string;
}

export default function ReportsOverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const reportCards: ReportCard[] = [
    {
      id: 'executive',
      title: 'Executive Overview',
      description: 'Comprehensive hospital performance metrics and KPIs',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      route: 'executive',
    },
    {
      id: 'claims',
      title: 'Claims & Reconciliation',
      description: 'HMO claims tracking, denials, and reconciliation analytics',
      icon: FileText,
      iconColor: 'text-green-600',
      route: 'claims',
    },
    {
      id: 'consultation',
      title: 'Consultation/OPD',
      description: 'Outpatient department performance and consultation metrics',
      icon: Stethoscope,
      iconColor: 'text-purple-600',
      route: 'consultation',
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      description: 'Lab test turnaround times, sample quality, and workload distribution',
      icon: FlaskConical,
      iconColor: 'text-pink-600',
      route: 'laboratory',
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      description: 'Dispensing efficiency, stock management, and drug utilization',
      icon: Pill,
      iconColor: 'text-orange-600',
      route: 'pharmacy',
    },
    {
      id: 'nursing',
      title: 'Nursing',
      description: 'Triage, vitals monitoring, and patient care metrics',
      icon: Heart,
      iconColor: 'text-red-600',
      route: 'nursing',
    },
    {
      id: 'radiology',
      title: 'Radiology',
      description: 'Imaging turnaround, equipment utilization, and quality metrics',
      icon: ScanLine,
      iconColor: 'text-indigo-600',
      route: 'radiology',
    },
    {
      id: 'surgery',
      title: 'Surgery/Theater',
      description: 'Operating room utilization, outcomes, and surgical performance',
      icon: Scissors,
      iconColor: 'text-teal-600',
      route: 'surgery',
    },
  ];

  const handleViewReport = (route: string) => {
    if (user?.role) {
      const routePrefix = roleMetadata[user.role].routePrefix;
      navigate(`${routePrefix}/reports/${route}`);
    }
  };

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Access comprehensive dashboards and performance reports across all hospital departments
          </p>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reportCards.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.id}
                className="hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group"
                onClick={() => handleViewReport(report.route)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm">
                        {report.description}
                      </CardDescription>
                    </div>
                    <Icon className={`h-8 w-8 ${report.iconColor} flex-shrink-0 ml-2`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(report.route);
                    }}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About Analytics Dashboards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              These dashboards integrate with your business intelligence tools (PowerBI, Metabase, Tableau)
              to provide real-time insights into hospital operations.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Configure embed URLs to connect your existing BI dashboards</li>
              <li>Monitor critical alerts and threshold breaches in real-time</li>
              <li>Export reports for offline analysis and stakeholder presentations</li>
              <li>Customize date ranges to analyze trends over time</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
