import { Consultation } from '@/types/clinical.types';
import { Patient } from '@/types/patient.types';
import { ConsultationSummary } from '../molecules/ConsultationSummary';

interface ConsultationReadOnlyViewProps {
  consultation: Consultation;
  patient: Patient;
  doctorName?: string;
}

export function ConsultationReadOnlyView({ consultation, patient, doctorName }: ConsultationReadOnlyViewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <ConsultationSummary
        consultation={consultation}
        patient={patient}
        doctorName={doctorName}
      />
    </div>
  );
}
