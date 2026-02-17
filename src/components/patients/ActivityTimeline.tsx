import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Pill,
  FlaskConical,
  Receipt,
  Activity,
  Clock,
  ArrowRight,
  CheckCircle,
  Edit,
  Save,
  Package,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

import { useConsultationsByPatient } from '@/hooks/queries/useConsultationQueries';
import { useVitals } from '@/hooks/queries/useVitalQueries';
import { usePrescriptionsByPatient } from '@/hooks/queries/usePrescriptionQueries';
import { useLabOrdersByPatient } from '@/hooks/queries/useLabQueries';
import { useBills } from '@/hooks/queries/useBillQueries';
import { useStaff } from '@/hooks/queries/useStaffQueries';
import { Consultation, VitalSigns, Prescription, LabOrder, Bill, Staff } from '@/types/clinical.types';

type AuditAction = 'consultation_started' | 'consultation_saved_draft' | 'consultation_finalized' | 'consultation_amended' | 'bundle_applied';

type ActivityType = 'consultation' | 'vitals' | 'prescription' | 'lab' | 'payment' | 'audit';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  meta?: string;
}

interface ActivityTimelineProps {
  patientId: string;
  limit?: number;
  onViewAll?: () => void;
  onActivityClick?: (type: ActivityType, id: string) => void;
}

// Only surface high-level audit events in the timeline
const TIMELINE_AUDIT_ACTIONS: AuditAction[] = [
  'consultation_started',
  'consultation_saved_draft',
  'consultation_finalized',
  'consultation_amended',
  'bundle_applied',
];

function getAuditTitle(action: AuditAction): string {
  switch (action) {
    case 'consultation_started': return 'Consultation Started';
    case 'consultation_finalized': return 'Consultation Finalized';
    case 'consultation_amended': return 'Consultation Amended';
    case 'consultation_saved_draft': return 'Draft Saved';
    case 'bundle_applied': return 'Bundle Applied';
    default: return action;
  }
}

function getAuditIcon(action: AuditAction): React.ReactNode {
  switch (action) {
    case 'consultation_started': return <Stethoscope className="h-4 w-4" />;
    case 'consultation_finalized': return <CheckCircle className="h-4 w-4" />;
    case 'consultation_amended': return <Edit className="h-4 w-4" />;
    case 'consultation_saved_draft': return <Save className="h-4 w-4" />;
    case 'bundle_applied': return <Package className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
}

export function ActivityTimeline({
  patientId,
  limit = 5,
  onViewAll,
  onActivityClick
}: ActivityTimelineProps) {
  const { data: consultationsData = [] } = useConsultationsByPatient(patientId);
  const { data: vitalsData = [] } = useVitals({ patientId });
  const { data: prescriptionsData = [] } = usePrescriptionsByPatient(patientId);
  const { data: labOrdersData = [] } = useLabOrdersByPatient(patientId);
  const { data: billsData = [] } = useBills({ patientId });
  const { data: staffData = [] } = useStaff();

  const activities = useMemo(() => {
    const items: ActivityItem[] = [];
    const staff = staffData as Staff[];

    // Consultations
    (consultationsData as Consultation[]).forEach((c) => {
      const doctor = staff.find((s) => s.id === c.doctorId);
      items.push({
        id: c.id,
        type: 'consultation',
        title: 'Consultation',
        description: c.chiefComplaint,
        timestamp: new Date(c.createdAt),
        icon: <Stethoscope className="h-4 w-4" />,
        meta: doctor?.name,
      });
    });

    // Vitals
    (vitalsData as VitalSigns[]).forEach((v) => {
      const nurse = staff.find((s) => s.id === v.recordedBy);
      items.push({
        id: v.id,
        type: 'vitals',
        title: 'Vitals Recorded',
        description: `BP ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}, Temp ${v.temperature}°C`,
        timestamp: new Date(v.recordedAt),
        icon: <Activity className="h-4 w-4" />,
        meta: nurse?.name,
      });
    });

    // Prescriptions
    (prescriptionsData as Prescription[]).forEach((p) => {
      items.push({
        id: p.id,
        type: 'prescription',
        title: p.status === 'dispensed' ? 'Prescription Dispensed' : 'Prescription Issued',
        description: (p.items || []).map((i) => i.drugName).join(', '),
        timestamp: new Date(p.prescribedAt),
        icon: <Pill className="h-4 w-4" />,
        meta: p.doctorName,
      });
    });

    // Lab Orders
    (labOrdersData as LabOrder[]).forEach((l) => {
      const statusText = l.status === 'completed' ? 'Lab Results Ready' :
        l.status === 'sample_collected' ? 'Sample Collected' : 'Lab Ordered';
      items.push({
        id: l.id,
        type: 'lab',
        title: statusText,
        description: (l.tests || []).map((t) => t.testName).join(', '),
        timestamp: new Date(l.completedAt || l.orderedAt),
        icon: <FlaskConical className="h-4 w-4" />,
      });
    });

    // Bills/Payments
    (billsData as Bill[]).forEach((b) => {
      if (b.amountPaid > 0) {
        items.push({
          id: b.id,
          type: 'payment',
          title: 'Payment Received',
          description: `₦${b.amountPaid.toLocaleString()} ${b.status === 'paid' ? '(Full)' : '(Partial)'}`,
          timestamp: new Date(b.paidAt || b.createdAt),
          icon: <Receipt className="h-4 w-4" />,
        });
      }
    });

    // Sort by timestamp descending and limit
    return items
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }, [consultationsData, vitalsData, prescriptionsData, labOrdersData, billsData, staffData, patientId, limit]);

  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500';
      case 'vitals': return 'bg-green-500';
      case 'prescription': return 'bg-purple-500';
      case 'lab': return 'bg-orange-500';
      case 'payment': return 'bg-emerald-500';
      case 'audit': return 'bg-slate-500';
      default: return 'bg-primary';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs">Patient history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
        {onViewAll && activities.length >= limit && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className={cn(
                  "relative pl-6 cursor-pointer group",
                  onActivityClick && "hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg"
                )}
                onClick={() => onActivityClick?.(activity.type, activity.id)}
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center",
                  getTypeColor(activity.type)
                )}>
                  <div className="h-2 w-2 rounded-full bg-background" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{activity.title}</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                  {activity.meta && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.meta}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
