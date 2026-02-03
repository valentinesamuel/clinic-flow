import { useMemo } from 'react';
import { format } from 'date-fns';
import { 
  User, 
  AlertTriangle, 
  Clock, 
  Activity,
  Play,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { QueueEntry } from '@/types/patient.types';
import { calculateWaitTime } from '@/data/queue';
import { getPatientById } from '@/data/patients';
import { getVitalsByPatient } from '@/data/vitals';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface QueueTableProps {
  entries: QueueEntry[];
  currentPage: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onRowClick: (entry: QueueEntry) => void;
  onStart?: (entry: QueueEntry) => void;
  onViewHistory?: (patientId: string) => void;
  onTransfer?: (entry: QueueEntry) => void;
  selectedEntryId?: string;
}

export function QueueTable({
  entries,
  currentPage,
  itemsPerPage = 10,
  onPageChange,
  onRowClick,
  onStart,
  onViewHistory,
  onTransfer,
  selectedEntryId,
}: QueueTableProps) {
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, startIndex + itemsPerPage);

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 15) return 'text-green-600 dark:text-green-400';
    if (minutes < 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const priorityConfig = {
    normal: { label: 'Normal', variant: 'outline' as const, className: '' },
    high: { label: 'High', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300' },
    emergency: { label: 'Emergency', variant: 'destructive' as const, className: 'animate-pulse' },
  };

  const statusConfig = {
    waiting: { label: 'Waiting', className: 'bg-blue-500' },
    in_progress: { label: 'In Progress', className: 'bg-green-500' },
    completed: { label: 'Completed', className: 'bg-gray-400' },
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12 font-semibold text-xs uppercase tracking-wider">#</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Patient</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Age/Gender</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Reason</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Priority</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Wait Time</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider hidden xl:table-cell">Vitals</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <User className="h-8 w-8 mb-2" />
                    <p>No patients in queue</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEntries.map((entry, index) => {
                const patient = getPatientById(entry.patientId);
                const vitals = patient ? getVitalsByPatient(patient.id)[0] : null;
                const waitMinutes = calculateWaitTime(entry.checkInTime);
                const priority = priorityConfig[entry.priority];
                const status = statusConfig[entry.status as keyof typeof statusConfig] || statusConfig.waiting;
                const position = startIndex + index + 1;
                const isSelected = selectedEntryId === entry.id;
                const age = patient 
                  ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  : null;
                const initials = patient 
                  ? `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase()
                  : '??';

                return (
                  <TableRow 
                    key={entry.id}
                    onClick={() => onRowClick(entry)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected && 'bg-primary/5 border-l-2 border-l-primary',
                      entry.priority === 'emergency' && !isSelected && 'bg-destructive/5',
                      'hover:bg-accent/50'
                    )}
                  >
                    <TableCell className="font-bold text-lg text-muted-foreground">
                      {entry.status === 'waiting' ? position : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={patient?.photoUrl} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{entry.patientName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{entry.patientMrn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {age && patient && (
                        <span className="text-sm">
                          {age} yrs • {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm truncate max-w-[200px]">{entry.reasonForVisit}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={priority.variant} 
                        className={cn('text-xs', priority.className)}
                      >
                        {entry.priority === 'emergency' && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {priority.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={cn('text-sm font-medium', getWaitTimeColor(waitMinutes))}>
                          {waitMinutes} min
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {vitals ? (
                        <div className="flex items-center gap-2 text-xs">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
                          </span>
                          <span className="text-muted-foreground">|</span>
                          <span>{vitals.oxygenSaturation}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No vitals</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', status.className)} />
                        <span className="text-xs">{status.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {entry.status === 'waiting' && onStart && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStart(entry);
                            }}
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            See
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onViewHistory && (
                              <DropdownMenuItem onClick={() => onViewHistory(entry.patientId)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                            )}
                            {onTransfer && entry.status === 'waiting' && (
                              <DropdownMenuItem onClick={() => onTransfer(entry)}>
                                Transfer Patient
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
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, entries.length)} of {entries.length}
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
