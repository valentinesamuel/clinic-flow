export type AlertSeverity = 'green' | 'amber' | 'red';

export type DashboardType =
  | 'executive'
  | 'claims'
  | 'consultation'
  | 'laboratory'
  | 'pharmacy'
  | 'nursing'
  | 'radiology'
  | 'surgery';

export interface DashboardMetadata {
  title: string;
  description: string;
  metrics: string[];
}
