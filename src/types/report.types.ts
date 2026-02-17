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

// Report Summary Types
export interface ReportSummary {
  financial: {
    totalRevenue: number;
    outstandingPayments: number;
    claimsPending: number;
    collectionRate: number;
  };
  operational: {
    totalPatientsToday: number;
    avgWaitTime: number;
    bedOccupancy: number;
    staffOnDuty: number;
  };
  clinical: {
    consultationsCompleted: number;
    abnormalResults: number;
    prescriptionsFilled: number;
    followUpsScheduled: number;
  };
  inventory: {
    lowStockItems: number;
    totalInventoryValue: number;
    expiringItems: number;
    pendingOrders: number;
  };
}

export interface ReportAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  metric?: string;
  value?: string;
  threshold?: string;
}
