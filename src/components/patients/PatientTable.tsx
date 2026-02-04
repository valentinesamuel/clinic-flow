// PatientTable - Refactored to use atomic components

import { format, formatDistanceToNow } from 'date-fns';
import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/data/patients';
import { PAGINATION } from '@/constants/designSystem';

// Atomic components
import { PatientNumber } from '@/components/atoms/display/PatientNumber';
import { PatientAge } from '@/components/atoms/display/PatientAge';
import { GenderIcon } from '@/components/atoms/display/GenderIcon';
import { PhoneNumber } from '@/components/atoms/display/PhoneNumber';
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { StatusBadge } from '@/components/atoms/display/StatusBadge';

// Molecule components
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';

// UI components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Edit, Copy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PatientTableProps {
  patients: Patient[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onViewPatient: (patient: Patient) => void;
  onEditPatient?: (patient: Patient) => void;
}

export function PatientTable({
  patients,
  loading = false,
  currentPage,
  totalPages,
  itemsPerPage = PAGINATION.defaultPageSize,
  onPageChange,
  onPageSizeChange,
  onViewPatient,
  onEditPatient,
}: PatientTableProps) {
  const { toast } = useToast();

  const copyMRN = (mrn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mrn);
    toast({
      title: 'Copied',
      description: `MRN ${mrn} copied to clipboard`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No patients found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px] font-semibold text-xs uppercase tracking-wider">MRN</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Patient</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Age/Gender</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Payment</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Last Visit</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient, index) => {
                const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
                const lastVisitDate = new Date(patient.updatedAt);
                const relativeTime = formatDistanceToNow(lastVisitDate, { addSuffix: true });

                return (
                  <TableRow 
                    key={patient.id} 
                    className={cn(
                      'cursor-pointer transition-colors',
                      'hover:bg-accent/50',
                      index % 2 === 1 && 'bg-muted/20'
                    )}
                    onClick={() => onViewPatient(patient)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-1 group">
                        <PatientNumber number={patient.mrn} size="sm" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => copyMRN(patient.mrn, e)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={patient.photoUrl} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">
                            {patient.firstName} {patient.lastName}
                          </p>
                          {patient.email && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {patient.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PatientAge dateOfBirth={patient.dateOfBirth} />
                        <GenderIcon gender={patient.gender} showLabel size="sm" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <PhoneNumber phone={patient.phone} />
                    </TableCell>
                    <TableCell>
                      <InsuranceBadge 
                        paymentType={patient.paymentType} 
                        hmoName={patient.hmoDetails?.providerName}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-muted-foreground cursor-default">
                            {relativeTime}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(lastVisitDate, 'MMMM d, yyyy')}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={patient.isActive ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewPatient(patient);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                        {onEditPatient && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditPatient(patient);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Patient</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {patients.map((patient) => {
            const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

            return (
              <div 
                key={patient.id} 
                className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewPatient(patient)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={patient.photoUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <PatientNumber number={patient.mrn} size="sm" />
                    </div>
                  </div>
                  <InsuranceBadge 
                    paymentType={patient.paymentType} 
                    hmoName={patient.hmoDetails?.providerName}
                  />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <PatientAge dateOfBirth={patient.dateOfBirth} />
                    <GenderIcon gender={patient.gender} size="sm" />
                  </div>
                  <PhoneNumber phone={patient.phone} />
                  <StatusBadge status={patient.isActive ? 'active' : 'inactive'} size="sm" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination with page size selector */}
        <QueuePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={patients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          showPageSizeSelector={!!onPageSizeChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </TooltipProvider>
  );
}
