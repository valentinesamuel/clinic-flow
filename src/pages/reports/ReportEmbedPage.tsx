import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3,
  FileDown,
  Maximize2,
  Minimize2,
  Settings,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { DashboardType } from '@/types/report.types';
import { getSeverityColor } from '@/utils/reportUtils';
import { useReportAlerts } from '@/hooks/queries/useReportQueries';
import { format } from 'date-fns';

interface ReportEmbedPageProps {
  dashboardType: DashboardType;
  title: string;
  description: string;
  metrics: string[];
}

type DateRangeOption = 'today' | 'week' | 'month' | 'quarter';

export default function ReportEmbedPage({
  dashboardType,
  title,
  description,
  metrics,
}: ReportEmbedPageProps) {
  const { toast } = useToast();
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: allAlerts = {} } = useReportAlerts();
  const alerts = ((allAlerts as any)[dashboardType] || []) as any[];

  const dateRangeButtons: { value: DateRangeOption; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  const handleConfigureEmbed = () => {
    if (tempUrl.trim()) {
      setEmbedUrl(tempUrl);
      setIsConfiguring(false);
      toast({
        title: 'Dashboard connected',
        description: 'Your BI dashboard has been successfully embedded.',
      });
    } else {
      setEmbedUrl('');
      setIsConfiguring(false);
    }
  };

  const handleExport = () => {
    toast({
      title: 'Report exported',
      description: `${title} has been exported successfully.`,
    });
  };

  const getSeverityIcon = (severity: 'green' | 'amber' | 'red') => {
    switch (severity) {
      case 'green':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'amber':
        return <AlertCircle className="h-4 w-4" />;
      case 'red':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {dateRangeButtons.map((range) => (
                <Button
                  key={range.value}
                  variant={selectedDateRange === range.value ? 'default' : 'outline'}
                  onClick={() => setSelectedDateRange(range.value)}
                  size="sm"
                >
                  {range.label}
                </Button>
              ))}
              <div className="ml-auto text-sm text-muted-foreground flex items-center">
                Last updated: {format(new Date(), 'PPp')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts Banner */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} flex items-start gap-3`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{alert.message}</p>
                      {alert.metric && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span>
                            <strong>Metric:</strong> {alert.metric}
                          </span>
                          {alert.value && (
                            <span>
                              <strong>Current:</strong> {alert.value}
                            </span>
                          )}
                          {alert.threshold && (
                            <span>
                              <strong>Target:</strong> {alert.threshold}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        alert.severity === 'red'
                          ? 'destructive'
                          : alert.severity === 'amber'
                          ? 'default'
                          : 'secondary'
                      }
                      className="flex-shrink-0"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {metric}
                  </p>
                  <p className="text-2xl font-bold text-primary">--</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect dashboard to view data
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Embed Container */}
        <Card className="min-h-[600px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dashboard View</CardTitle>
              {!isConfiguring && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfiguring(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Embed URL
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isConfiguring ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    PowerBI / Metabase / Tableau Embed URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://app.powerbi.com/view?r=..."
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the embed URL from your BI tool. Ensure the URL has proper permissions for iframe embedding.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConfigureEmbed}>
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsConfiguring(false);
                      setTempUrl('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : embedUrl ? (
              <div className="w-full h-[550px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src={embedUrl}
                  title={title}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-border rounded-lg bg-muted/20">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Dashboard</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Integrate your PowerBI, Metabase, or Tableau dashboard by configuring the embed URL.
                  Your analytics will appear here in real-time.
                </p>
                <Button onClick={() => setIsConfiguring(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Embed URL
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
