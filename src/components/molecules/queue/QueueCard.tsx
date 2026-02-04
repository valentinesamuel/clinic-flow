import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PatientNumber,
  WaitTimeIndicator,
  PriorityBadge,
  PaymentStatusBadge,
  GenderShort,
  BloodTypeDisplay,
} from '@/components/atoms/display';
import { QueueEntry, QueueConfig, PAUSE_REASON_LABELS } from '@/types/queue.types';
import {
  MoreVertical,
  Phone,
  Eye,
  UserCheck,
  Clock,
  XCircle,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { formatRelativeTime } from '@/constants/designSystem';

interface QueueCardProps {
  entry: QueueEntry;
  config: QueueConfig;
  onCall?: (entry: QueueEntry) => void;
  onView?: (entry: QueueEntry) => void;
  onComplete?: (entry: QueueEntry) => void;
  onPause?: (entry: QueueEntry) => void;
  onResume?: (entry: QueueEntry) => void;
  onNoShow?: (entry: QueueEntry) => void;
  showPaymentStatus?: boolean;
  showPauseInfo?: boolean;
  className?: string;
}

export function QueueCard({
  entry,
  config,
  onCall,
  onView,
  onComplete,
  onPause,
  onResume,
  onNoShow,
  showPaymentStatus = true,
  showPauseInfo = false,
  className,
}: QueueCardProps) {
  const initials = entry.patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isInProgress = entry.status === 'in_progress';
  const isPaused = entry.status === 'paused';
  const isWaiting = entry.status === 'waiting';

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md cursor-pointer',
        entry.priority === 'emergency' && 'border-destructive border-2',
        entry.priority === 'high' && 'border-warning',
        isInProgress && 'bg-primary/5 border-primary',
        isPaused && 'bg-warning/5 border-warning',
        className
      )}
      onClick={() => onView?.(entry)}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={entry.patientName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {entry.patientName}
              </span>
              <PatientNumber number={entry.patientMrn} size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={entry.priority} size="sm" />
            <WaitTimeIndicator minutes={entry.waitTimeMinutes} compact />
          </div>
        </div>

        {/* Info Row */}
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span>#{entry.queueNumber.toString().padStart(3, '0')}</span>
          <span>•</span>
          <span>Joined {formatRelativeTime(entry.joinedAt)}</span>
          {entry.assignedToName && (
            <>
              <span>•</span>
              <span className="text-primary">{entry.assignedToName}</span>
            </>
          )}
        </div>

        {/* Chief Complaint (if present) */}
        {entry.chiefComplaint && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {entry.chiefComplaint}
          </p>
        )}

        {/* Pause Info (for review queue) */}
        {showPauseInfo && isPaused && entry.pauseReason && (
          <div className="mt-2 flex items-center gap-2 text-xs text-warning">
            <PauseCircle className="h-3 w-3" />
            <span>
              {PAUSE_REASON_LABELS[entry.pauseReason]}
              {entry.pausedAt && ` • Paused ${formatRelativeTime(entry.pausedAt)}`}
            </span>
          </div>
        )}

        {/* Footer Row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showPaymentStatus && (
              <PaymentStatusBadge status={entry.paymentStatus} size="sm" />
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Primary Action Button */}
            {isWaiting && onCall && (
              <Button size="sm" onClick={() => onCall(entry)}>
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
            {isInProgress && onComplete && (
              <Button size="sm" variant="default" onClick={() => onComplete(entry)}>
                <UserCheck className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            {isPaused && onResume && (
              <Button size="sm" variant="default" onClick={() => onResume(entry)}>
                <PlayCircle className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={() => onView?.(entry)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {isInProgress && onPause && (
                  <DropdownMenuItem onClick={() => onPause(entry)}>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pause
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onNoShow?.(entry)}
                  className="text-destructive focus:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark No-Show
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
