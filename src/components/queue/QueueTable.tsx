// QueueTable - Refactored to use atomic components

import { useMemo, useState } from 'react';
import { User, Activity, Play, Eye, MoreHorizontal } from 'lucide-react';
import { QueueEntry } from '@/types/patient.types';
import { usePatients } from '@/hooks/queries/usePatientQueries';
import { useVitals } from '@/hooks/queries/useVitalQueries';
import { calculateWaitTime } from '@/data/queue';
import { PAGINATION } from '@/constants/designSystem';

// Atomic components
import { PatientNumber } from '@/components/atoms/display/PatientNumber';
import { WaitTimeIndicator } from '@/components/atoms/display/WaitTimeIndicator';
import { PriorityBadge } from '@/components/atoms/display/PriorityBadge';
import { StatusBadge } from '@/components/atoms/display/StatusBadge';
import { PatientAge } from '@/components/atoms/display/PatientAge';
import { GenderIcon } from '@/components/atoms/display/GenderIcon';

// Molecule components
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';

// UI components
import { Button } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface QueueTableProps {
  entries: QueueEntry[];
  currentPage: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick: (entry: QueueEntry) => void;
  onStart?: (entry: QueueEntry) => void;
  onViewHistory?: (patientId: string) => void;
  onTransfer?: (entry: QueueEntry) => void;
  selectedEntryId?: string;
}

export function QueueTable({
  entries,
  currentPage,
  itemsPerPage = PAGINATION.defaultPageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onStart,
  onViewHistory,
  onTransfer,
  selectedEntryId,
}: QueueTableProps) {
  const [confirmEntry, setConfirmEntry] = useState<QueueEntry | null>(null);

  const { data: patientsData } = usePatients();
  const patients = patientsData ?? [];
  const { data: vitalsData } = useVitals();
  const allVitals = vitalsData ?? [];

  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getVitalsByPatient = (patientId: string) =>
    allVitals.filter(v => v.patientId === patientId).sort((a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, startIndex + itemsPerPage);

  const statusMap = {
    waiting: 'waiting' as const,
    in_progress: 'in_progress' as const,
    completed: 'completed' as const,
    cancelled: 'cancelled' as const,
    no_show: 'no_show' as const,
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
                const position = startIndex + index + 1;
                const isSelected = selectedEntryId === entry.id;
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
                          <PatientNumber number={entry.patientMrn} size="sm" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {patient && (
                        <div className="flex items-center gap-2">
                          <PatientAge dateOfBirth={patient.dateOfBirth} />
                          <span className="text-muted-foreground">•</span>
                          <GenderIcon gender={patient.gender} showLabel size="sm" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm truncate max-w-[200px]">{entry.reasonForVisit}</p>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={entry.priority} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <WaitTimeIndicator minutes={waitMinutes} showIcon />
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
                      <StatusBadge status={statusMap[entry.status as keyof typeof statusMap] || 'waiting'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {entry.status === 'waiting' && onStart && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmEntry(entry);
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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmEntry} onOpenChange={(open) => !open && setConfirmEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Consultation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start a consultation with{' '}
              <span className="font-medium text-foreground">{confirmEntry?.patientName}</span>.
              This will mark the patient as in progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmEntry && onStart) {
                  onStart(confirmEntry);
                }
                setConfirmEntry(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination with page size selector */}
      <QueuePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={entries.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        showPageSizeSelector={!!onPageSizeChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
