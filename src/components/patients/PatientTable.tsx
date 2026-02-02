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
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No patients found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const paymentBadgeVariant = {
    cash: 'secondary',
    hmo: 'default',
    corporate: 'outline',
  } as const;

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">MRN</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const age = calculateAge(patient.dateOfBirth);
              const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
              const genderIcon = patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧';

              return (
                <TableRow key={patient.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {patient.mrn}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.photoUrl} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {patient.firstName} {patient.lastName}
                        </p>
                        {patient.email && (
                          <p className="text-xs text-muted-foreground">{patient.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {age} yrs {genderIcon}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{patient.phone}</TableCell>
                  <TableCell>
                    <Badge variant={paymentBadgeVariant[patient.paymentType]} className="text-xs">
                      {patient.paymentType === 'hmo' 
                        ? patient.hmoDetails?.providerName 
                        : patient.paymentType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(patient.updatedAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.isActive ? 'default' : 'secondary'}>
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewPatient(patient)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onEditPatient && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditPatient(patient)}
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
              className="border rounded-lg p-4 space-y-3"
              onClick={() => onViewPatient(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
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
                <Badge variant={paymentBadgeVariant[patient.paymentType]} className="text-xs">
                  {patient.paymentType === 'hmo' 
                    ? patient.hmoDetails?.providerName 
                    : patient.paymentType.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{age} years {genderIcon}</span>
                <span>{patient.phone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
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
