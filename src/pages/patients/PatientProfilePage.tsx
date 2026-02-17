import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientProfile } from '@/components/patients/PatientProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePatient } from '@/hooks/queries/usePatientQueries';

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/${user?.role?.replace('_', '-') || 'receptionist'}`;

  const { data: patient, isLoading } = usePatient(id ?? '');

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Patient not found</h2>
          <p className="text-muted-foreground mb-4">The patient you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`${basePath}/patients`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(`${basePath}/patients`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
        <PatientProfile
          patient={patient}
          onEdit={() => navigate(`${basePath}/patients/${id}/edit`)}
        />
      </div>
    </DashboardLayout>
  );
}
