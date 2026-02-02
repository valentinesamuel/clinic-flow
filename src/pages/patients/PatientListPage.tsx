import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSearch } from '@/components/patients/PatientSearch';
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { getPatientsPaginated } from '@/data/patients';
import { Patient, PaymentType } from '@/types/patient.types';

export default function PatientListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const basePath = `/${user?.role?.replace('_', '-') || 'receptionist'}`;

  useEffect(() => {
    setLoading(true);
    const paymentFilter = filter !== 'all' ? filter as PaymentType : undefined;
    const result = getPatientsPaginated(currentPage, 20, { 
      paymentType: paymentFilter,
      search: searchQuery 
    });
    setPatients(result.patients);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [currentPage, filter, searchQuery]);

  const handleViewPatient = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}`);
  };

  const handleEditPatient = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}/edit`);
  };

  const handleRegisterNew = () => {
    navigate(`${basePath}/patients/new`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        <PatientTable
          patients={patients}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
        />
      </div>
    </DashboardLayout>
  );
}
