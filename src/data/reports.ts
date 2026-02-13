// Mock Report Summary Data

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

export const mockReportSummary: ReportSummary = {
  financial: {
    totalRevenue: 4850000,
    outstandingPayments: 1250000,
    claimsPending: 12,
    collectionRate: 78.5,
  },
  operational: {
    totalPatientsToday: 45,
    avgWaitTime: 23,
    bedOccupancy: 62,
    staffOnDuty: 18,
  },
  clinical: {
    consultationsCompleted: 32,
    abnormalResults: 8,
    prescriptionsFilled: 28,
    followUpsScheduled: 15,
  },
  inventory: {
    lowStockItems: 5,
    totalInventoryValue: 8500000,
    expiringItems: 3,
    pendingOrders: 2,
  },
};

// Report Alert Types
export type AlertSeverity = 'green' | 'amber' | 'red';

export interface ReportAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  metric?: string;
  value?: string;
  threshold?: string;
}

// Dashboard Type Definitions
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

// Report Metadata for Each Dashboard
export const reportMetadata: Record<DashboardType, DashboardMetadata> = {
  executive: {
    title: 'Executive Overview Dashboard',
    description: 'Comprehensive hospital performance metrics and KPIs',
    metrics: [
      'Total Patient Traffic',
      'Average Length of Stay (ALOS)',
      'Bed Occupancy Rate',
      'Revenue Realization',
      'Patient Wait Time',
      'Inventory Alert Level',
    ],
  },
  claims: {
    title: 'Claims & Reconciliation Dashboard',
    description: 'HMO claims tracking, denials, and reconciliation analytics',
    metrics: [
      'Claims Submission Velocity',
      'Clean Claim Rate',
      'Denial Rate by Payer',
      'Days Sales Outstanding (DSO)',
      'Short-payment Variance',
      'Unvetted Claims Backlog',
    ],
  },
  consultation: {
    title: 'Consultation/OPD Dashboard',
    description: 'Outpatient department performance and consultation metrics',
    metrics: [
      'OPD Volume',
      'Average Consultation Time',
      'Follow-up Rate',
      'Referral Rate',
    ],
  },
  laboratory: {
    title: 'Laboratory Analytics Dashboard',
    description: 'Lab test turnaround times, sample quality, and workload distribution',
    metrics: [
      'Turnaround Time (TAT) by Test Type',
      'Sample Rejection Rate',
      'Critical Value Notification Time',
      'Workload Distribution',
    ],
  },
  pharmacy: {
    title: 'Pharmacy Operations Dashboard',
    description: 'Dispensing efficiency, stock management, and drug utilization',
    metrics: [
      'Dispensing Turnaround Time (TAT)',
      'Stock-out Rate',
      'Prescription Error Rate',
      'Drug Utilization',
    ],
  },
  nursing: {
    title: 'Nursing Performance Dashboard',
    description: 'Triage, vitals monitoring, and patient care metrics',
    metrics: [
      'Triage Turnaround Time (TAT)',
      'Vitals Completion Rate',
      'Patient-Nurse Ratio',
      'Incident Reports',
    ],
  },
  radiology: {
    title: 'Radiology Efficiency Dashboard',
    description: 'Imaging turnaround, equipment utilization, and quality metrics',
    metrics: [
      'Imaging Turnaround Time (TAT)',
      'Report Turnaround',
      'Equipment Utilization',
      'Repeat Rate',
    ],
  },
  surgery: {
    title: 'Surgery/Theater Dashboard',
    description: 'Operating room utilization, outcomes, and surgical performance',
    metrics: [
      'Operating Room (OR) Utilization',
      'Cancellation Rate',
      'Surgical Site Infection Rate',
      'Average Procedure Time',
    ],
  },
};

// Mock Alerts Data
export const mockAlerts: Record<DashboardType, ReportAlert[]> = {
  executive: [
    {
      id: 'exec-1',
      severity: 'red',
      message: 'Bed occupancy has exceeded 85% capacity threshold',
      metric: 'Bed Occupancy Rate',
      value: '92%',
      threshold: '85%',
    },
    {
      id: 'exec-2',
      severity: 'amber',
      message: 'Average patient wait time trending above target',
      metric: 'Patient Wait Time',
      value: '28 mins',
      threshold: '20 mins',
    },
    {
      id: 'exec-3',
      severity: 'green',
      message: 'Revenue realization on track for quarterly target',
    },
  ],
  claims: [
    {
      id: 'claims-1',
      severity: 'red',
      message: 'Unvetted claims backlog exceeds 7-day SLA',
      metric: 'Unvetted Claims Backlog',
      value: '45 claims',
      threshold: '20 claims',
    },
    {
      id: 'claims-2',
      severity: 'amber',
      message: 'Clean claim rate below 95% target',
      metric: 'Clean Claim Rate',
      value: '89%',
      threshold: '95%',
    },
  ],
  consultation: [
    {
      id: 'consult-1',
      severity: 'amber',
      message: 'Follow-up rate trending below 60% benchmark',
      metric: 'Follow-up Rate',
      value: '54%',
      threshold: '60%',
    },
    {
      id: 'consult-2',
      severity: 'green',
      message: 'OPD volume within normal range',
    },
  ],
  laboratory: [
    {
      id: 'lab-1',
      severity: 'red',
      message: 'Sample rejection rate exceeds acceptable threshold',
      metric: 'Sample Rejection Rate',
      value: '8.2%',
      threshold: '3%',
    },
    {
      id: 'lab-2',
      severity: 'amber',
      message: 'Critical value notification time exceeds 30-minute target',
      metric: 'Critical Value Notification Time',
      value: '42 mins',
      threshold: '30 mins',
    },
  ],
  pharmacy: [
    {
      id: 'pharm-1',
      severity: 'amber',
      message: 'Stock-out incidents detected for 3 high-demand medications',
      metric: 'Stock-out Rate',
      value: '3 items',
    },
    {
      id: 'pharm-2',
      severity: 'green',
      message: 'Dispensing TAT within acceptable range',
    },
  ],
  nursing: [
    {
      id: 'nursing-1',
      severity: 'red',
      message: 'Patient-nurse ratio exceeds safe staffing levels',
      metric: 'Patient-Nurse Ratio',
      value: '12:1',
      threshold: '8:1',
    },
    {
      id: 'nursing-2',
      severity: 'amber',
      message: 'Vitals completion rate below 98% target',
      metric: 'Vitals Completion Rate',
      value: '94%',
      threshold: '98%',
    },
  ],
  radiology: [
    {
      id: 'radio-1',
      severity: 'amber',
      message: 'Equipment utilization below optimal level',
      metric: 'Equipment Utilization',
      value: '62%',
      threshold: '75%',
    },
    {
      id: 'radio-2',
      severity: 'green',
      message: 'Imaging TAT within SLA targets',
    },
  ],
  surgery: [
    {
      id: 'surgery-1',
      severity: 'amber',
      message: 'OR utilization below 80% target',
      metric: 'OR Utilization',
      value: '71%',
      threshold: '80%',
    },
    {
      id: 'surgery-2',
      severity: 'green',
      message: 'Surgical site infection rate within acceptable range',
    },
  ],
};

// Utility function to get severity color classes
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

// Utility function to get severity badge color
export const getSeverityBadgeVariant = (severity: AlertSeverity): 'default' | 'secondary' | 'destructive' => {
  switch (severity) {
    case 'green':
      return 'secondary';
    case 'amber':
      return 'default';
    case 'red':
      return 'destructive';
    default:
      return 'default';
  }
};
