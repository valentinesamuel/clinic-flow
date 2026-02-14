import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPrescriptions } from '@/data/prescriptions';
import { getPatientById } from '@/data/patients';
import { useAuth } from '@/hooks/useAuth';
import { Search, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type PrescriptionStatus = 'pending' | 'dispensed' | 'partially_dispensed' | 'cancelled';

export default function PrescriptionListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter prescriptions based on role
  const prescriptions = useMemo(() => {
    if (user?.role === 'doctor') {
      // Show only prescriptions written by this doctor
      return mockPrescriptions.filter((rx) => rx.doctorId === user.id);
    }
    // Pharmacist sees all prescriptions
    return mockPrescriptions;
  }, [user]);

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    let results = prescriptions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((prescription) => {
        const patient = getPatientById(prescription.patientId);
        if (!patient) return false;

        const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const drugNames = prescription.items
          .map((item) => item.drugName.toLowerCase())
          .join(' ');

        return patientName.includes(query) || drugNames.includes(query);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter((rx) => rx.status === statusFilter);
    }

    return results;
  }, [prescriptions, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const basePath = user?.role === 'doctor' ? '/doctor' : '/pharmacist';
  const handleRowClick = (prescriptionId: string) => {
    navigate(`${basePath}/prescriptions/${prescriptionId}`);
  };

  const getStatusVariant = (status: PrescriptionStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'dispensed':
        return 'success';
      case 'partially_dispensed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: PrescriptionStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'dispensed':
        return 'Dispensed';
      case 'partially_dispensed':
        return 'Partially Dispensed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const pageTitle = user?.role === 'doctor' ? 'My Prescriptions' : 'Prescription Queue';

  return (
    <DashboardLayout allowedRoles={['doctor', 'pharmacist', 'cmo', 'hospital_admin', 'cashier', 'receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              {user?.role === 'doctor'
                ? 'Manage prescriptions you have written'
                : 'Review and dispense prescriptions'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Prescriptions</CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by patient name or drug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                  <SelectItem value="partially_dispensed">Partially Dispensed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {/* Prescriptions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Drugs</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No prescriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPrescriptions.map((prescription) => {
                      const patient = getPatientById(prescription.patientId);
                      if (!patient) return null;

                      const drugCount = prescription.items.length;
                      const drugSummary =
                        drugCount === 1
                          ? prescription.items[0].drugName
                          : `${prescription.items[0].drugName} +${drugCount - 1} more`;

                      return (
                        <TableRow
                          key={prescription.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(prescription.id)}
                        >
                          <TableCell className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[200px]">{drugSummary}</span>
                              {drugCount > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  {drugCount}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {prescription.doctorName}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prescription.prescribedAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(prescription.status)}>
                              {getStatusLabel(prescription.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {prescription.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredPrescriptions.length)} of{' '}
                  {filteredPrescriptions.length} prescriptions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
