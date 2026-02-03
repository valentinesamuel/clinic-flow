import { format } from 'date-fns';
import { 
  User, 
  Clock, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Appointment } from '@/types/clinical.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AppointmentTableProps {
  appointments: Appointment[];
  currentPage: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onCheckIn?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onNoShow?: (appointment: Appointment) => void;
  onViewPatient?: (patientId: string) => void;
}

export function AppointmentTable({
  appointments,
  currentPage,
  itemsPerPage = 15,
  onPageChange,
  onCheckIn,
  onReschedule,
  onCancel,
  onNoShow,
  onViewPatient,
}: AppointmentTableProps) {
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  const typeConfig: Record<string, { label: string; className: string }> = {
    consultation: { label: 'Consultation', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200' },
    follow_up: { label: 'Follow-up', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200' },
    emergency: { label: 'Emergency', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200' },
    lab_only: { label: 'Lab Only', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200' },
    procedure: { label: 'Procedure', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200' },
  };

  const statusConfig: Record<string, { label: string; dotColor: string; textColor: string }> = {
    scheduled: { label: 'Scheduled', dotColor: 'bg-blue-500', textColor: 'text-blue-600' },
    confirmed: { label: 'Confirmed', dotColor: 'bg-green-500', textColor: 'text-green-600' },
    checked_in: { label: 'Checked In', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600' },
    in_progress: { label: 'In Progress', dotColor: 'bg-amber-500', textColor: 'text-amber-600' },
    completed: { label: 'Completed', dotColor: 'bg-gray-400', textColor: 'text-gray-500' },
    cancelled: { label: 'Cancelled', dotColor: 'bg-red-400', textColor: 'text-red-500' },
    no_show: { label: 'No Show', dotColor: 'bg-red-500', textColor: 'text-red-600' },
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Time</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Patient</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Type</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Doctor</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden xl:table-cell">Reason</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mb-2" />
                    <p>No appointments found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((apt) => {
                const type = typeConfig[apt.appointmentType] || typeConfig.consultation;
                const status = statusConfig[apt.status] || statusConfig.scheduled;
                const initials = apt.patientName
                  ? apt.patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : '??';

                return (
                  <TableRow 
                    key={apt.id}
                    className={cn(
                      'transition-colors hover:bg-accent/50',
                      apt.status === 'cancelled' && 'opacity-60',
                      apt.appointmentType === 'emergency' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell>
                      <div className="font-semibold text-sm">{apt.scheduledTime}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(apt.scheduledDate), 'MMM d')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{apt.patientMrn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={cn('text-xs border', type.className)}>
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{apt.doctorName}</span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <p className="text-sm truncate max-w-[200px]">{apt.reasonForVisit}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', status.dotColor)} />
                        <span className={cn('text-xs font-medium', status.textColor)}>
                          {status.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {apt.status === 'scheduled' && onCheckIn && (
                          <Button
                            size="sm"
                            onClick={() => onCheckIn(apt)}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Check In
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onViewPatient && (
                              <DropdownMenuItem onClick={() => onViewPatient(apt.patientId)}>
                                <User className="h-4 w-4 mr-2" />
                                View Patient
                              </DropdownMenuItem>
                            )}
                            {onReschedule && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => onReschedule(apt)}>
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {onNoShow && apt.status === 'scheduled' && (
                              <DropdownMenuItem 
                                onClick={() => onNoShow(apt)}
                                className="text-orange-600"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Mark No Show
                              </DropdownMenuItem>
                            )}
                            {onCancel && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => onCancel(apt)}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Appointment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, appointments.length)} of {appointments.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-9"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
