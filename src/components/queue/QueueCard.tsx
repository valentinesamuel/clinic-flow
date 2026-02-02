// QueueCard - Patient queue item display with priority and wait time

import { format, differenceInMinutes } from 'date-fns';
import { Clock, AlertTriangle, User, Activity, MoreHorizontal, ArrowRight, Eye, Play } from 'lucide-react';
import { QueueEntry, QueuePriority } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface QueueCardProps {
  entry: QueueEntry;
  position?: number;
  vitals?: VitalSigns;
  showVitals?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  onStart?: (entry: QueueEntry) => void;
  onComplete?: (entry: QueueEntry) => void;
  onTransfer?: (entry: QueueEntry) => void;
  onSkip?: (entry: QueueEntry) => void;
  onViewHistory?: (patientId: string) => void;
  onClick?: () => void;
}

const priorityConfig: Record<QueuePriority, { label: string; className: string; icon?: boolean }> = {
  normal: { label: 'Normal', className: 'bg-muted text-muted-foreground border-muted' },
  high: { label: 'High', className: 'bg-amber-500/10 text-amber-700 border-amber-200' },
  emergency: { label: 'Emergency', className: 'bg-destructive text-destructive-foreground border-destructive animate-pulse', icon: true },
};

function getWaitTimeDisplay(checkInTime: string): { text: string; severity: 'good' | 'warning' | 'critical' } {
  const minutes = differenceInMinutes(new Date(), new Date(checkInTime));
  
  if (minutes < 15) {
    return { text: `${minutes} min`, severity: 'good' };
  } else if (minutes < 30) {
    return { text: `${minutes} min`, severity: 'warning' };
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { 
      text: hours > 0 ? `${hours}h ${mins}m` : `${minutes} min`, 
      severity: 'critical' 
    };
  }
}

const waitTimeColors = {
  good: 'text-green-600',
  warning: 'text-amber-600',
  critical: 'text-destructive',
};

export function QueueCard({
  entry,
  position,
  vitals,
  showVitals = false,
  showActions = true,
  variant = 'default',
  onStart,
  onComplete,
  onTransfer,
  onSkip,
  onViewHistory,
  onClick,
}: QueueCardProps) {
  const priorityStyle = priorityConfig[entry.priority];
  const waitTime = getWaitTimeDisplay(entry.checkInTime);
  const isActive = entry.status === 'in_progress';
  const isWaiting = entry.status === 'waiting';

  // Check for abnormal vitals
  const hasAbnormalVitals = vitals && (
    vitals.bloodPressureSystolic > 140 || 
    vitals.bloodPressureDiastolic > 90 ||
    vitals.oxygenSaturation < 95 ||
    vitals.temperature > 38
  );

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors',
          isActive && 'border-primary bg-primary/5',
          entry.priority === 'emergency' && 'border-destructive',
          onClick && 'cursor-pointer hover:bg-accent/50'
        )}
        onClick={onClick}
      >
        {position !== undefined && (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
            #{position}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{entry.patientName}</p>
          <p className="text-sm text-muted-foreground truncate">{entry.reasonForVisit}</p>
        </div>
        <div className={cn('text-sm font-medium', waitTimeColors[waitTime.severity])}>
          {waitTime.text}
        </div>
        {entry.priority !== 'normal' && (
          <Badge className={cn('shrink-0', priorityStyle.className)}>
            {priorityStyle.icon && <AlertTriangle className="h-3 w-3 mr-1" />}
            {priorityStyle.label}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      isActive && 'ring-2 ring-primary',
      entry.priority === 'emergency' && 'border-destructive shadow-destructive/20 shadow-lg',
      onClick && 'cursor-pointer hover:shadow-md'
    )}>
      <CardContent className="p-4" onClick={onClick}>
        {/* Header with Position & Priority */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {position !== undefined && (
              <div className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0',
                entry.priority === 'emergency' ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary'
              )}>
                #{position}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-base">{entry.patientName}</h4>
              <p className="text-sm text-muted-foreground">{entry.patientMrn}</p>
            </div>
          </div>
          <Badge className={cn(priorityStyle.className)}>
            {priorityStyle.icon && <AlertTriangle className="h-3 w-3 mr-1" />}
            {priorityStyle.label}
          </Badge>
        </div>

        {/* Reason for Visit */}
        <p className="text-sm mb-3">{entry.reasonForVisit}</p>

        {/* Vitals Summary (if shown) */}
        {showVitals && vitals && (
          <div className={cn(
            'flex flex-wrap gap-3 p-2 rounded-md mb-3 text-sm',
            hasAbnormalVitals ? 'bg-destructive/10' : 'bg-muted'
          )}>
            <span className={cn(
              vitals.bloodPressureSystolic > 140 || vitals.bloodPressureDiastolic > 90 
                ? 'text-destructive font-medium' 
                : ''
            )}>
              BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
            </span>
            <span className={cn(vitals.temperature > 38 ? 'text-destructive font-medium' : '')}>
              Temp: {vitals.temperature}°C
            </span>
            <span className={cn(vitals.oxygenSaturation < 95 ? 'text-destructive font-medium' : '')}>
              O₂: {vitals.oxygenSaturation}%
            </span>
            <span>Pulse: {vitals.pulse} bpm</span>
          </div>
        )}

        {/* Wait Time & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Wait:</span>
            <span className={cn('font-medium', waitTimeColors[waitTime.severity])}>
              {waitTime.text}
            </span>
          </div>
          {isActive && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              In Progress
            </Badge>
          )}
        </div>

        {/* Notes if any */}
        {entry.notes && (
          <p className="text-sm text-muted-foreground italic mb-3 p-2 bg-muted/50 rounded">
            {entry.notes}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-3 border-t">
            {isWaiting && onStart && (
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onStart(entry); }}>
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {isActive && onComplete && (
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onComplete(entry); }}>
                Complete
              </Button>
            )}
            {onViewHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onViewHistory(entry.patientId); }}
              >
                <Eye className="h-4 w-4 mr-1" />
                History
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onTransfer && (
                  <DropdownMenuItem onClick={() => onTransfer(entry)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Transfer
                  </DropdownMenuItem>
                )}
                {onSkip && isWaiting && (
                  <DropdownMenuItem onClick={() => onSkip(entry)}>
                    Skip for Now
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
