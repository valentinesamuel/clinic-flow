import { Consultation } from '@/types/clinical.types';
import { Patient } from '@/types/patient.types';
import { PatientBanner } from './PatientBanner';
import { SOAPSubjective } from './SOAPSubjective';
import { SOAPObjective } from './SOAPObjective';
import { SOAPAssessment } from './SOAPAssessment';
import { SOAPPlan } from './SOAPPlan';
import { ConsultationDiagnosis } from '@/types/consultation.types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { User, Calendar } from 'lucide-react';

interface ConsultationSummaryProps {
  consultation: Consultation;
  patient: Patient;
  doctorName?: string;
}

export function ConsultationSummary({ consultation, patient, doctorName }: ConsultationSummaryProps) {
  const diagnoses: ConsultationDiagnosis[] = consultation.diagnosis.map((desc, i) => ({
    code: consultation.icdCodes[i] || '',
    description: desc,
    isPrimary: i === 0,
  }));

  return (
    <div className="space-y-4">
      <PatientBanner patient={patient} />

      <div className="flex items-center gap-4 px-4 text-sm text-muted-foreground">
        {doctorName && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {doctorName}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(new Date(consultation.createdAt), 'PPP')}
        </span>
        {consultation.status && (
          <Badge variant={consultation.status === 'finalized' ? 'default' : 'secondary'} className="capitalize">
            {consultation.status}
          </Badge>
        )}
      </div>

      <div className="space-y-4 px-4 pb-4">
        <SOAPSubjective
          chiefComplaint={consultation.chiefComplaint}
          onChiefComplaintChange={() => {}}
          hpi={consultation.historyOfPresentIllness}
          onHPIChange={() => {}}
          readOnly
        />
        <SOAPObjective
          physicalExamination={consultation.physicalExamination}
          onChange={() => {}}
          readOnly
        />
        <SOAPAssessment
          selectedDiagnoses={diagnoses}
          onAdd={() => {}}
          onRemove={() => {}}
          onSetPrimary={() => {}}
          readOnly
        />
        <SOAPPlan
          treatmentPlan={consultation.treatmentPlan}
          onChange={() => {}}
          locked={false}
          prescriptionCount={consultation.prescriptionId ? 1 : 0}
          labOrderCount={consultation.labOrderIds.length}
          onAddPrescription={() => {}}
          onAddLabOrder={() => {}}
          followUpDate={consultation.followUpDate || null}
          onFollowUpChange={() => {}}
          readOnly
        />
      </div>
    </div>
  );
}
