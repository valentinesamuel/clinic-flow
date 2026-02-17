// PatientListPage - Refactored to use atomic components

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSearch } from '@/components/patients/PatientSearch';
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Patient, PaymentType } from '@/types/patient.types';
import { PAGINATION } from '@/constants/designSystem';
import { usePatientsPaginated } from '@/hooks/queries/usePatientQueries';

export default function PatientListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const basePath = `/${user?.role?.replace('_', '-') || 'receptionist'}`;

  const paymentFilter = filter !== 'all' ? filter as PaymentType : undefined;
  const { data, isLoading: loading } = usePatientsPaginated(currentPage, itemsPerPage, {
    paymentType: paymentFilter,
    search: searchQuery,
  });
  const patients: Patient[] = (data as any)?.patients ?? (data as any)?.data ?? [];
  const totalPages = (data as any)?.totalPages ?? 1;

  const handleViewPatient = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}`);
  };

  const handleEditPatient = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}/edit`);
  };

  const handleRegisterNew = () => {
    navigate(`${basePath}/patients/new`);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Button onClick={handleRegisterNew}>
            <Plus className="h-4 w-4 mr-2" />
            Register New Patient
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <PatientSearch
              onSelect={handleViewPatient}
              onRegisterNew={handleRegisterNew}
              placeholder="Search by name, phone, or patient number..."
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter patients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="hmo">Has Insurance</SelectItem>
              <SelectItem value="cash">No Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PatientTable now uses atomic components internally */}
        <PatientTable
          patients={patients}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
        />
      </div>
    </DashboardLayout>
  );
}
