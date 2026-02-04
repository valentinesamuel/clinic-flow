// QueueCard - Refactored to use atomic components

import { differenceInMinutes } from 'date-fns';
import { MoreHorizontal, ArrowRight, Eye, Play } from 'lucide-react';
import { QueueEntry } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';

// Atomic components
import { WaitTimeIndicator } from '@/components/atoms/display/WaitTimeIndicator';
import { PriorityBadge } from '@/components/atoms/display/PriorityBadge';
import { PatientNumber } from '@/components/atoms/display/PatientNumber';

// UI components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const waitMinutes = differenceInMinutes(new Date(), new Date(entry.checkInTime));
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
        <WaitTimeIndicator minutes={waitMinutes} compact />
        {entry.priority !== 'normal' && (
          <PriorityBadge priority={entry.priority} size="sm" />
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
              <PatientNumber number={entry.patientMrn} size="sm" />
            </div>
          </div>
          <PriorityBadge priority={entry.priority} />
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
          <WaitTimeIndicator minutes={waitMinutes} showIcon />
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
