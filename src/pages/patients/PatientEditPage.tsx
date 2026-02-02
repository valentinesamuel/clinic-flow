import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm';
import { Patient } from '@/types/patient.types';
import { getPatientById } from '@/data/patients';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PatientEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/${user?.role?.replace('_', '-') || 'receptionist'}`;

  const patient = id ? getPatientById(id) : undefined;

  const handleSuccess = (updatedPatient: Patient) => {
    navigate(`${basePath}/patients/${updatedPatient.id}`);
  };

  const handleCancel = () => {
    navigate(`${basePath}/patients/${id}`);
  };

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The patient you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate(`${basePath}/patients`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PatientRegistrationForm 
        onSuccess={handleSuccess} 
        onCancel={handleCancel}
        initialPatient={patient}
      />
    </DashboardLayout>
  );
}
