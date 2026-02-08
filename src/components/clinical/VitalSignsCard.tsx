import { VitalSigns } from '@/types/clinical.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Thermometer, 
  Wind, 
  Droplets, 
  Scale, 
  Ruler, 
  Activity,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VitalSignsCardProps {
  vitals: VitalSigns;
  showRecordedBy?: boolean;
  recordedByName?: string;
  compact?: boolean;
}

// Vital sign thresholds for abnormal detection
const thresholds = {
  bloodPressureSystolic: { low: 90, high: 140, criticalLow: 80, criticalHigh: 180 },
  bloodPressureDiastolic: { low: 60, high: 90, criticalLow: 50, criticalHigh: 120 },
  temperature: { low: 36.0, high: 37.5, criticalLow: 35.0, criticalHigh: 39.0 },
  pulse: { low: 60, high: 100, criticalLow: 50, criticalHigh: 120 },
  respiratoryRate: { low: 12, high: 20, criticalLow: 8, criticalHigh: 30 },
  oxygenSaturation: { low: 95, high: 100, criticalLow: 90, criticalHigh: 100 },
};

export function getVitalStatus(
  field: keyof typeof thresholds, 
  value: number
): { status: 'normal' | 'warning' | 'critical'; direction?: 'high' | 'low' } {
  const threshold = thresholds[field];
  if (!threshold) return { status: 'normal' };

  if (value <= threshold.criticalLow) return { status: 'critical', direction: 'low' };
  if (value >= threshold.criticalHigh) return { status: 'critical', direction: 'high' };
  if (value < threshold.low) return { status: 'warning', direction: 'low' };
  if (value > threshold.high) return { status: 'warning', direction: 'high' };
  return { status: 'normal' };
}

export function getBMICategory(bmi: number): { label: string; status: 'normal' | 'warning' | 'critical' } {
  if (bmi < 18.5) return { label: 'Underweight', status: 'warning' };
  if (bmi < 25) return { label: 'Normal', status: 'normal' };
  if (bmi < 30) return { label: 'Overweight', status: 'warning' };
  return { label: 'Obese', status: 'critical' };
}

interface VitalMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  direction?: 'high' | 'low';
  compact?: boolean;
}

function VitalMetric({ icon, label, value, unit, status, direction, compact }: VitalMetricProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-3 rounded-lg border",
      status === 'normal' && "bg-background border-border",
      status === 'warning' && "bg-yellow-500/10 border-yellow-500/50",
      status === 'critical' && "bg-destructive/10 border-destructive/50"
    )}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        {status !== 'normal' && direction && (
          direction === 'high' ? 
            <ArrowUp className="h-3 w-3 text-destructive" /> : 
            <ArrowDown className="h-3 w-3 text-blue-500" />
        )}
      </div>
      <span className={cn(
        "text-lg font-bold",
        status === 'warning' && "text-yellow-600",
        status === 'critical' && "text-destructive"
      )}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{unit}</span>
      {!compact && (
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      )}
      {status !== 'normal' && (
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] mt-1",
            status === 'warning' && "text-yellow-600 border-yellow-600",
            status === 'critical' && "text-destructive border-destructive"
          )}
        >
          {direction === 'high' ? 'HIGH' : 'LOW'}
        </Badge>
      )}
    </div>
  );
}

export function VitalSignsCard({ vitals, showRecordedBy, recordedByName, compact }: VitalSignsCardProps) {
  const bpSystolicStatus = getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic);
  const bpDiastolicStatus = getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic);
  const tempStatus = getVitalStatus('temperature', vitals.temperature);
  const pulseStatus = getVitalStatus('pulse', vitals.pulse);
  const rrStatus = getVitalStatus('respiratoryRate', vitals.respiratoryRate);
  const o2Status = getVitalStatus('oxygenSaturation', vitals.oxygenSaturation);
  const bmiCategory = getBMICategory(vitals.bmi);

  // BP status is the worse of systolic/diastolic
  const bpStatus = bpSystolicStatus.status === 'critical' || bpDiastolicStatus.status === 'critical' 
    ? 'critical' 
    : bpSystolicStatus.status === 'warning' || bpDiastolicStatus.status === 'warning'
      ? 'warning'
      : 'normal';
  const bpDirection = bpSystolicStatus.direction || bpDiastolicStatus.direction;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Latest Vital Signs
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(vitals.recordedAt), 'dd MMM yyyy, hh:mm a')}
          </div>
        </div>
        {showRecordedBy && recordedByName && (
          <p className="text-xs text-muted-foreground">Recorded by: {recordedByName}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid",
          compact ? "grid-cols-2 gap-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        )}>
          <VitalMetric
            icon={<Heart className="h-4 w-4 text-primary" />}
            label="Blood Pressure"
            value={`${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`}
            unit="mmHg"
            status={bpStatus}
            direction={bpDirection}
            compact={compact}
          />
          <VitalMetric
            icon={<Thermometer className="h-4 w-4 text-primary" />}
            label="Temperature"
            value={vitals.temperature.toFixed(1)}
            unit="°C"
            status={tempStatus.status}
            direction={tempStatus.direction}
            compact={compact}
          />
          <VitalMetric
            icon={<Activity className="h-4 w-4 text-primary" />}
            label="Pulse Rate"
            value={String(vitals.pulse)}
            unit="bpm"
            status={pulseStatus.status}
            direction={pulseStatus.direction}
            compact={compact}
          />
          <VitalMetric
            icon={<Droplets className="h-4 w-4 text-primary" />}
            label="O₂ Saturation"
            value={String(vitals.oxygenSaturation)}
            unit="%"
            status={o2Status.status}
            direction={o2Status.direction}
            compact={compact}
          />
          <VitalMetric
            icon={<Wind className="h-4 w-4 text-primary" />}
            label="Respiratory Rate"
            value={String(vitals.respiratoryRate)}
            unit="/min"
            status={rrStatus.status}
            direction={rrStatus.direction}
            compact={compact}
          />
          <VitalMetric
            icon={<Scale className="h-4 w-4 text-primary" />}
            label="Weight"
            value={String(vitals.weight)}
            unit="kg"
            status="normal"
            compact={compact}
          />
          <VitalMetric
            icon={<Ruler className="h-4 w-4 text-primary" />}
            label="Height"
            value={String(vitals.height)}
            unit="cm"
            status="normal"
            compact={compact}
          />
          <VitalMetric
            icon={<Activity className="h-4 w-4 text-primary" />}
            label="BMI"
            value={vitals.bmi.toFixed(1)}
            unit={bmiCategory.label}
            status={bmiCategory.status}
            compact={compact}
          />
        </div>
        {vitals.notes && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{vitals.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
