import type { AlertSeverity } from '@/types/report.types';

export const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'green':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'amber':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'red':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

export const getSeverityBadgeVariant = (severity: AlertSeverity): 'default' | 'secondary' | 'destructive' => {
  switch (severity) {
    case 'red':
      return 'destructive';
    case 'amber':
      return 'default';
    case 'green':
    default:
      return 'secondary';
  }
};
