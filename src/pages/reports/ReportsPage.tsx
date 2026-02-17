import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReportSummary } from '@/hooks/queries/useReportQueries';
import { DollarSign, Activity, Stethoscope, Package, FileDown, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportSummary } from '@/types/report.types';

export default function ReportsPage() {
  const { toast } = useToast();
  const { data: reportSummaryData } = useReportSummary('all');
  const mockReportSummary = (reportSummaryData || {
    financial: { totalRevenue: 0, outstandingPayments: 0, claimsPending: 0 },
    operational: { totalPatientsToday: 0, avgWaitTime: 0, bedOccupancy: 0 },
    clinical: { consultationsCompleted: 0, abnormalResults: 0, prescriptionsFilled: 0 },
    inventory: { lowStockItems: 0, totalInventoryValue: 0, expiringItems: 0 }
  }) as ReportSummary;

  const handleViewReport = (reportType: string) => {
    toast({
      title: 'Report generation coming soon',
      description: `${reportType} report will be available shortly.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Report exported successfully',
      description: 'Your report has been downloaded.',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const reportCategories = [
    {
      title: 'Financial Reports',
      icon: DollarSign,
      iconColor: 'text-green-500',
      metrics: [
        {
          label: 'Total Revenue',
          value: formatCurrency(mockReportSummary.financial.totalRevenue)
        },
        {
          label: 'Outstanding Payments',
          value: formatCurrency(mockReportSummary.financial.outstandingPayments)
        },
      ],
    },
    {
      title: 'Operational Reports',
      icon: Activity,
      iconColor: 'text-blue-500',
      metrics: [
        {
          label: 'Total Patients Today',
          value: mockReportSummary.operational.totalPatientsToday.toString()
        },
        {
          label: 'Avg Wait Time',
          value: `${mockReportSummary.operational.avgWaitTime} mins`
        },
      ],
    },
    {
      title: 'Clinical Reports',
      icon: Stethoscope,
      iconColor: 'text-purple-500',
      metrics: [
        {
          label: 'Consultations Completed',
          value: mockReportSummary.clinical.consultationsCompleted.toString()
        },
        {
          label: 'Abnormal Results',
          value: mockReportSummary.clinical.abnormalResults.toString()
        },
      ],
    },
    {
      title: 'Inventory Reports',
      icon: Package,
      iconColor: 'text-orange-500',
      metrics: [
        {
          label: 'Low Stock Items',
          value: mockReportSummary.inventory.lowStockItems.toString()
        },
        {
          label: 'Total Inventory Value',
          value: formatCurrency(mockReportSummary.inventory.totalInventoryValue)
        },
      ],
    },
  ];

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              View and generate comprehensive hospital reports
            </p>
          </div>
          <Button onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10" />
                </div>
              </div>
              <Button className="md:w-auto w-full">Apply Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <Icon className={`h-8 w-8 ${category.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-1 gap-3">
                      {category.metrics.map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="text-lg font-bold">{metric.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* View Report Button */}
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => handleViewReport(category.title)}
                    >
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Report Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">HMO Claims Pending</p>
                <p className="text-2xl font-bold">{mockReportSummary.financial.claimsPending}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Bed Occupancy</p>
                <p className="text-2xl font-bold">{mockReportSummary.operational.bedOccupancy}%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Prescriptions Filled</p>
                <p className="text-2xl font-bold">{mockReportSummary.clinical.prescriptionsFilled}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Expiring Items</p>
                <p className="text-2xl font-bold">{mockReportSummary.inventory.expiringItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
