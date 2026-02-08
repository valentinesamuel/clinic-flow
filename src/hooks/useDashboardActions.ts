import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/user.types';

export function useDashboardActions(role: UserRole) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getRoleBasePath = () => {
    switch (role) {
      case 'doctor': return '/doctor';
      case 'nurse': return '/nurse';
      case 'receptionist': return '/receptionist';
      case 'cmo': return '/cmo';
      case 'clinical_lead': return '/clinical-lead';
      case 'hospital_admin': return '/hospital-admin';
      case 'pharmacist': return '/pharmacist';
      case 'lab_tech': return '/lab-tech';
      case 'cashier': return '/cashier';
      case 'patient': return '/patient';
      default: return '/receptionist';
    }
  };

  const basePath = getRoleBasePath();

  const actions = {
    // Common actions
    viewPatients: () => navigate(`${basePath}/patients`),
    newPatient: () => navigate(`${basePath}/patients/new`),
    searchPatients: () => navigate(`${basePath}/patients`),
    viewAppointments: () => navigate(`${basePath}/appointments`),
    
    // Doctor-specific actions
    startConsultation: () => navigate(`${basePath}/consultation/new`),
    openConsultation: (patientId: string, queueEntryId?: string) => {
      const params = new URLSearchParams({ patientId });
      if (queueEntryId) params.set('queueEntryId', queueEntryId);
      navigate(`${basePath}/consultation?${params.toString()}`);
    },
    viewQueue: () => {
      if (role === 'nurse') {
        navigate('/nurse/triage');
      } else {
        navigate(`${basePath}/queue`);
      }
    },
    orderLabTest: () => toast({
      title: 'Coming Soon',
      description: 'Lab ordering will be available in a future update.',
    }),
    writePrescription: () => toast({
      title: 'Coming Soon',
      description: 'Prescription writing will be available in a future update.',
    }),
    patientHistory: () => navigate(`${basePath}/patients`),
    
    // Nurse-specific actions
    startTriage: () => navigate('/nurse/triage'),
    recordVitals: () => navigate('/nurse/triage'),
    
    // Receptionist-specific actions
    checkIn: () => navigate('/receptionist/check-in'),
    bookAppointment: () => navigate(`${basePath}/appointments`),
    
    // Navigate to patient profile
    viewPatientProfile: (patientId: string) => navigate(`${basePath}/patients/${patientId}`),
    editPatient: (patientId: string) => navigate(`${basePath}/patients/${patientId}/edit`),
  };

  return { actions, basePath };
}
