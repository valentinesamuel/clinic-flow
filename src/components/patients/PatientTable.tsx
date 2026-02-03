import { format, formatDistanceToNow } from 'date-fns';
import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/data/patients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Eye, Edit, ChevronLeft, ChevronRight, Phone, Copy, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PatientTableProps {
  patients: Patient[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewPatient: (patient: Patient) => void;
  onEditPatient?: (patient: Patient) => void;
}

export function PatientTable({
  patients,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
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
                const age = calculateAge(patient.dateOfBirth);
                const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
                const genderIcon = patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O';
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
                        <span className="font-mono text-xs text-muted-foreground">
                          {patient.mrn}
                        </span>
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
                        <span className="text-sm font-medium">{age}</span>
                        <span className="text-muted-foreground">yrs</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {genderIcon}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`tel:${patient.phone}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {patient.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={patient.paymentType === 'hmo' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {patient.paymentType === 'hmo' ? (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {patient.hmoDetails?.providerName || 'HMO'}
                          </div>
                        ) : (
                          patient.paymentType.toUpperCase()
                        )}
                      </Badge>
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
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'h-2 w-2 rounded-full',
                          patient.isActive ? 'bg-green-500' : 'bg-gray-400'
                        )} />
                        <span className="text-xs">
                          {patient.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
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
            const age = calculateAge(patient.dateOfBirth);
            const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
            const genderIcon = patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧';

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
                      <p className="text-xs text-muted-foreground font-mono">
                        {patient.mrn}
                      </p>
                    </div>
                  </div>
                  <Badge variant={patient.paymentType === 'hmo' ? 'default' : 'secondary'} className="text-xs">
                    {patient.paymentType === 'hmo' 
                      ? patient.hmoDetails?.providerName 
                      : patient.paymentType.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{age} years {genderIcon}</span>
                  <span>{patient.phone}</span>
                  <span className="flex items-center gap-1">
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      patient.isActive ? 'bg-green-500' : 'bg-gray-400'
                    )} />
                    {patient.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
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
              <div className="hidden sm:flex items-center gap-1">
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
    </TooltipProvider>
  );
}
