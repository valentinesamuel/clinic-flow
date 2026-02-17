import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { HMOAlertResult } from '@/types/consultation.types';

interface HMOAlertBannerProps {
  alerts: HMOAlertResult[];
}

export function HMOAlertBanner({ alerts }: HMOAlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">HMO Compliance Alerts</span>
      </div>
      {alerts.map(alert => {
        const isError = alert.rule.severity === 'error';
        const Icon = alert.passed ? CheckCircle2 : isError ? XCircle : AlertTriangle;
        const bgColor = alert.passed
          ? 'bg-green-50 border-green-200'
          : isError
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200';
        const iconColor = alert.passed
          ? 'text-green-600'
          : isError
            ? 'text-red-600'
            : 'text-amber-600';

        return (
          <div
            key={alert.rule.id}
            className={`flex items-start gap-2 p-2.5 rounded-md border text-sm ${bgColor}`}
          >
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{alert.rule.message}</p>
              {alert.actualValue !== undefined && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current: {String(alert.actualValue)}
                </p>
              )}
            </div>
            <Badge
              variant={alert.passed ? 'default' : 'destructive'}
              className="shrink-0 text-[10px]"
            >
              {alert.passed ? 'Pass' : 'Fail'}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
