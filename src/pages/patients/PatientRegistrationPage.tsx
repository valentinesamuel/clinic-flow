import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm';
import { Patient } from '@/types/patient.types';

export default function PatientRegistrationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/${user?.role?.replace('_', '-') || 'receptionist'}`;

  const handleSuccess = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}`);
  };

  const handleCancel = () => {
    navigate(`${basePath}/patients`);
  };

  return (
    <DashboardLayout>
      <PatientRegistrationForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </DashboardLayout>
  );
}
