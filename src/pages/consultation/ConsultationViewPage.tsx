import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ConsultationReadOnlyView } from '@/components/consultation/organisms/ConsultationReadOnlyView';
import { ConsultationVersionHistory } from '@/components/consultation/molecules/ConsultationVersionHistory';
import { AmendmentReasonDialog } from '@/components/consultation/molecules/AmendmentReasonDialog';
import { getConsultationById } from '@/data/consultations';
import { getPatientById } from '@/data/patients';
import { mockStaff } from '@/data/staff';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, History } from 'lucide-react';
import { AmendmentReason } from '@/types/consultation.types';

export default function ConsultationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [amendDialogOpen, setAmendDialogOpen] = useState(false);

  const consultation = id ? getConsultationById(id) : undefined;
  const patient = consultation ? getPatientById(consultation.patientId) : undefined;
  const doctor = consultation
    ? mockStaff.find(s => s.id === consultation.doctorId)
    : undefined;

  if (!consultation || !patient) {
    return (
      <DashboardLayout allowedRoles={['doctor', 'clinical_lead']}>
        <div className="p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Consultation Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The consultation you are looking for does not exist.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isFinalized = consultation.status === 'finalized';
  const hasVersions = consultation.versions.length > 0;

  const handleAmendConfirm = (reason: AmendmentReason, detail?: string) => {
    const params = new URLSearchParams({
      patientId: consultation.patientId,
      consultationId: consultation.id,
      mode: 'amend',
      reason,
    });
    if (detail) params.set('reasonDetail', detail);
    navigate(`/doctor/consultation?${params.toString()}`);
  };

  return (
    <DashboardLayout allowedRoles={['doctor', 'clinical_lead']}>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {hasVersions && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <History className="h-3 w-3" />
                v{consultation.currentVersion}
              </Badge>
            )}
            {isFinalized && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmendDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Amend Note
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <ConsultationReadOnlyView
            consultation={consultation}
            patient={patient}
            doctorName={doctor?.name}
          />

          {/* Version history */}
          {hasVersions && (
            <ConsultationVersionHistory
              versions={consultation.versions}
              currentVersion={consultation.currentVersion}
            />
          )}
        </div>
      </div>

      {/* Amendment reason dialog */}
      <AmendmentReasonDialog
        open={amendDialogOpen}
        onOpenChange={setAmendDialogOpen}
        onConfirm={handleAmendConfirm}
      />
    </DashboardLayout>
  );
}
