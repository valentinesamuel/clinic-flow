// AppointmentCard - Reusable appointment display component

import { format, parseISO, differenceInYears } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, MoreHorizontal } from 'lucide-react';
import { Appointment, AppointmentType, AppointmentStatus } from '@/types/clinical.types';
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

interface AppointmentCardProps {
  appointment: Appointment;
  variant?: 'default' | 'compact';
  showActions?: boolean;
  onCheckIn?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onNoShow?: (appointment: Appointment) => void;
  onViewProfile?: (patientId: string) => void;
  onStartConsultation?: (appointment: Appointment) => void;
  onClick?: () => void;
}

const typeConfig: Record<AppointmentType, { label: string; className: string }> = {
  consultation: { label: 'Consultation', className: 'bg-blue-500/10 text-blue-700 border-blue-200' },
  follow_up: { label: 'Follow-up', className: 'bg-teal-500/10 text-teal-700 border-teal-200' },
  emergency: { label: 'Emergency', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  procedure: { label: 'Procedure', className: 'bg-orange-500/10 text-orange-700 border-orange-200' },
  lab_only: { label: 'Lab Only', className: 'bg-purple-500/10 text-purple-700 border-purple-200' },
};

const statusConfig: Record<AppointmentStatus, { label: string; dotClass: string }> = {
  scheduled: { label: 'Scheduled', dotClass: 'bg-muted-foreground' },
  confirmed: { label: 'Confirmed', dotClass: 'bg-blue-500' },
  checked_in: { label: 'Checked In', dotClass: 'bg-amber-500' },
  in_progress: { label: 'In Progress', dotClass: 'bg-primary animate-pulse' },
  completed: { label: 'Completed', dotClass: 'bg-green-500' },
  cancelled: { label: 'Cancelled', dotClass: 'bg-muted-foreground' },
  no_show: { label: 'No Show', dotClass: 'bg-destructive' },
};

export function AppointmentCard({
  appointment,
  variant = 'default',
  showActions = true,
  onCheckIn,
  onReschedule,
  onCancel,
  onNoShow,
  onViewProfile,
  onStartConsultation,
  onClick,
}: AppointmentCardProps) {
  const typeStyle = typeConfig[appointment.appointmentType];
  const statusStyle = statusConfig[appointment.status];
  const isActionable = ['scheduled', 'confirmed'].includes(appointment.status);
  const canCheckIn = appointment.status === 'scheduled' || appointment.status === 'confirmed';
  const canStartConsultation = appointment.status === 'checked_in';

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer',
          appointment.status === 'cancelled' && 'opacity-50'
        )}
        onClick={onClick}
      >
        <div className="text-center shrink-0 w-12">
          <p className="text-lg font-semibold text-primary">{appointment.scheduledTime}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{appointment.patientName}</p>
          <p className="text-sm text-muted-foreground truncate">{appointment.reasonForVisit}</p>
        </div>
        <Badge variant="outline" className={cn('shrink-0', typeStyle.className)}>
          {typeStyle.label}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-md',
      appointment.status === 'cancelled' && 'opacity-60',
      appointment.appointmentType === 'emergency' && 'border-destructive/50'
    )}>
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium text-foreground">{appointment.scheduledTime}</span>
            <span>•</span>
            <span>{appointment.duration} min</span>
          </div>
          <Badge variant="outline" className={cn('shrink-0', typeStyle.className)}>
            {typeStyle.label}
          </Badge>
        </div>

        {/* Patient Info */}
        <div className="mb-3">
          <h4 className="font-semibold text-base">{appointment.patientName}</h4>
          <p className="text-sm text-muted-foreground">{appointment.patientMrn}</p>
        </div>

        {/* Reason for Visit */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {appointment.reasonForVisit}
        </p>

        {/* Doctor & Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.doctorName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={cn('h-2 w-2 rounded-full', statusStyle.dotClass)} />
            <span>{statusStyle.label}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-3 border-t">
            {canCheckIn && onCheckIn && (
              <Button size="sm" onClick={() => onCheckIn(appointment)}>
                Check In
              </Button>
            )}
            {canStartConsultation && onStartConsultation && (
              <Button size="sm" onClick={() => onStartConsultation(appointment)}>
                See Patient
              </Button>
            )}
            {onViewProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(appointment.patientId)}
              >
                View Profile
              </Button>
            )}
            {isActionable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onReschedule && (
                    <DropdownMenuItem onClick={() => onReschedule(appointment)}>
                      Reschedule
                    </DropdownMenuItem>
                  )}
                  {onNoShow && (
                    <DropdownMenuItem onClick={() => onNoShow(appointment)}>
                      Mark No Show
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onCancel && (
                    <DropdownMenuItem
                      onClick={() => onCancel(appointment)}
                      className="text-destructive focus:text-destructive"
                    >
                      Cancel Appointment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
