import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ConsultationForm } from '@/components/consultation/organisms/ConsultationForm';
import { PatientSearch } from '@/components/patients/PatientSearch';
import { Patient } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { ConsultationFormData } from '@/types/consultation.types';
import { PayerType } from '@/types/financial.types';
import { usePatient } from '@/hooks/queries/usePatientQueries';
import { useVitals } from '@/hooks/queries/useVitalQueries';
import { useConsultation } from '@/hooks/queries/useConsultationQueries';
import { useCreateConsultation, useUpdateConsultation } from '@/hooks/mutations/useConsultationMutations';
import { useCreateLabOrder } from '@/hooks/mutations/useLabMutations';
import { useCreatePrescription } from '@/hooks/mutations/usePrescriptionMutations';
import { useFinancialSidebar } from '@/hooks/useFinancialSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Search } from 'lucide-react';

export default function ConsultationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const patientIdParam = searchParams.get('patientId');
  const queueEntryId = searchParams.get('queueEntryId');
  const consultationIdParam = searchParams.get('consultationId');
  const mode = searchParams.get('mode'); // 'amend' for amendment mode

  // Pre-load patient from params via hooks
  const { data: preloadedPatient } = usePatient(patientIdParam || '');
  const { data: patientVitals = [] } = useVitals(patientIdParam ? { patientId: patientIdParam } : undefined);
  const { data: existingConsultation } = useConsultation(consultationIdParam || '');
  const createConsultationMutation = useCreateConsultation();
  const updateConsultationMutation = useUpdateConsultation();
  const createLabOrderMutation = useCreateLabOrder();
  const createPrescriptionMutation = useCreatePrescription();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalSigns | null>(null);

  // Sync preloaded patient from hook
  useEffect(() => {
    if (preloadedPatient && !selectedPatient) {
      setSelectedPatient(preloadedPatient as Patient);
      const v = patientVitals as any[];
      setVitals(v.length > 0 ? v[0] : null);
    }
  }, [preloadedPatient, patientVitals]);

  // Track form data at page level for financial sidebar
  const [currentLabOrders, setCurrentLabOrders] = useState<ConsultationFormData['labOrders']>([]);
  const [currentPrescriptions, setCurrentPrescriptions] = useState<ConsultationFormData['prescriptionItems']>([]);

  // Lift financial sidebar to page level
  const payerType: PayerType = selectedPatient?.paymentType ?? 'cash';
  const hmoProviderId = selectedPatient?.hmoDetails?.providerId;

  const { resolvedPrices, summary, priceSnapshotMap } = useFinancialSidebar(
    currentLabOrders,
    currentPrescriptions,
    payerType,
    hmoProviderId,
  );

  // Log consultation started on mount
  useEffect(() => {
    if (selectedPatient && user && mode !== 'amend') {
      // Audit logging handled server-side via mutations
    }
  }, [selectedPatient?.id]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    // Vitals will be loaded via hooks when patient changes
  };

  const handleSaveDraft = (formData: ConsultationFormData) => {
    if (!selectedPatient || !user) return;

    // Update tracked form data for financial sidebar
    setCurrentLabOrders(formData.labOrders);
    setCurrentPrescriptions(formData.prescriptionItems);

    if (existingConsultation) {
      updateConsultationMutation.mutate({
        id: (existingConsultation as any).id,
        data: {
          chiefComplaint: formData.chiefComplaint,
          historyOfPresentIllness: formData.historyOfPresentIllness,
          physicalExamination: formData.physicalExamination,
          diagnosis: formData.selectedDiagnoses.map(d => d.description),
          icdCodes: formData.selectedDiagnoses.map(d => d.code),
          treatmentPlan: formData.treatmentPlan,
          followUpDate: formData.followUpDate || undefined,
          status: 'draft',
        },
      } as any);
    } else {
      createConsultationMutation.mutate({
        patientId: selectedPatient.id,
        doctorId: user.id,
        appointmentId: queueEntryId || '',
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        physicalExamination: formData.physicalExamination,
        diagnosis: formData.selectedDiagnoses.map(d => d.description),
        icdCodes: formData.selectedDiagnoses.map(d => d.code),
        treatmentPlan: formData.treatmentPlan,
        labOrderIds: [],
        followUpDate: formData.followUpDate || undefined,
        status: 'draft',
      } as any);
    }

    toast({
      title: 'Draft Saved',
      description: 'Consultation draft has been saved.',
    });
  };

  const handleFinalize = (formData: ConsultationFormData) => {
    if (!selectedPatient || !user) return;

    // Update tracked form data
    setCurrentLabOrders(formData.labOrders);
    setCurrentPrescriptions(formData.prescriptionItems);

    const primaryDiagnosis = formData.selectedDiagnoses.find(d => d.isPrimary);
    const primaryIcdCode = primaryDiagnosis?.code || '';

    // Build metadata-enriched lab tests
    const labOrderIds: string[] = [];
    let prescriptionId: string | undefined;

    if (formData.labOrders.length > 0) {
      const testsWithMetadata = formData.labOrders.map(o => {
        const matchingJustification = formData.justifications.find(j => j.itemId === o.id || j.itemId === o.testCode);
        return {
          testCode: o.testCode,
          testName: o.testName,
          metadata: {
            linked_diagnosis: primaryIcdCode,
            is_from_bundle: o.metadata?.is_from_bundle || false,
            justification_provided: matchingJustification?.justificationText || '',
            payer_authorized: 'not_required' as const,
            original_price_at_order: priceSnapshotMap.get(o.testCode) || 0,
          },
        };
      });

      const labOrder = createLabOrder({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientMrn: selectedPatient.mrn,
        doctorId: user.id,
        doctorName: user.name,
        tests: testsWithMetadata,
        status: 'ordered',
        priority: formData.labOrders.some(o => o.priority === 'stat')
          ? 'stat'
          : formData.labOrders.some(o => o.priority === 'urgent')
            ? 'urgent'
            : 'routine',
        notes: formData.labOrders.map(o => o.notes).filter(Boolean).join('; ') || undefined,
      });
      labOrderIds.push(labOrder.id);

      logAuditEntry({
        action: 'lab_order_created',
        entityType: 'lab_order',
        entityId: labOrder.id,
        patientId: selectedPatient.id,
        performedBy: user.id,
        performedByName: user.name,
        details: { testCount: testsWithMetadata.length },
      });
    }

    if (formData.prescriptionItems.length > 0) {
      const itemsWithMetadata = formData.prescriptionItems.map(item => {
        const matchingJustification = formData.justifications.find(j => j.itemId === item.id);
        return {
          drugName: item.drugName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity,
          instructions: item.instructions,
          metadata: {
            linked_diagnosis: primaryIcdCode,
            is_from_bundle: item.metadata?.is_from_bundle || false,
            justification_provided: matchingJustification?.justificationText || '',
            payer_authorized: 'not_required' as const,
            original_price_at_order: priceSnapshotMap.get(item.drugName) || 0,
          },
        };
      });

      const rx = createPrescription({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        doctorId: user.id,
        doctorName: user.name,
        visitId: queueEntryId || '',
        items: itemsWithMetadata,
        status: 'pending',
        notes: formData.notes || undefined,
      });
      prescriptionId = rx.id;

      logAuditEntry({
        action: 'prescription_created',
        entityType: 'prescription',
        entityId: rx.id,
        patientId: selectedPatient.id,
        performedBy: user.id,
        performedByName: user.name,
        details: { itemCount: itemsWithMetadata.length },
      });
    }

    // Handle amendment mode
    if (mode === 'amend' && existingConsultation) {
      const amendmentReason = searchParams.get('reason') as 'typo' | 'new_clinical_data' | 'hmo_rejection_fix' | 'other' || 'other';
      const amendmentDetail = searchParams.get('reasonDetail') || undefined;

      amendConsultation(
        existingConsultation.id,
        formData,
        amendmentReason,
        amendmentDetail,
        user.id,
        user.name,
      );

      logAuditEntry({
        action: 'consultation_amended',
        entityType: 'consultation',
        entityId: existingConsultation.id,
        patientId: selectedPatient.id,
        performedBy: user.id,
        performedByName: user.name,
        details: { reason: amendmentReason, reasonDetail: amendmentDetail },
      });

      toast({
        title: 'Consultation Amended',
        description: `Consultation for ${selectedPatient.firstName} ${selectedPatient.lastName} has been amended.`,
      });

      navigate(`/doctor/consultation/view/${existingConsultation.id}`);
      return;
    }

    // Create or update consultation (normal finalize)
    if (existingConsultation) {
      updateConsultation(existingConsultation.id, {
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        physicalExamination: formData.physicalExamination,
        diagnosis: formData.selectedDiagnoses.map(d => d.description),
        icdCodes: formData.selectedDiagnoses.map(d => d.code),
        treatmentPlan: formData.treatmentPlan,
        labOrderIds,
        prescriptionId,
        followUpDate: formData.followUpDate || undefined,
        status: 'finalized',
      });
    } else {
      createConsultation({
        patientId: selectedPatient.id,
        doctorId: user.id,
        appointmentId: queueEntryId || '',
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        physicalExamination: formData.physicalExamination,
        diagnosis: formData.selectedDiagnoses.map(d => d.description),
        icdCodes: formData.selectedDiagnoses.map(d => d.code),
        treatmentPlan: formData.treatmentPlan,
        labOrderIds,
        prescriptionId,
        followUpDate: formData.followUpDate || undefined,
        status: 'finalized',
      });
    }

    // Log bundle deselections
    for (const deselection of formData.bundleDeselections) {
      logAuditEntry({
        action: 'bundle_item_deselected',
        entityType: 'bundle',
        entityId: deselection.bundleId,
        patientId: selectedPatient.id,
        performedBy: user.id,
        performedByName: user.name,
        details: {
          bundleName: deselection.bundleName,
          deselectedLabs: deselection.deselectedLabTestCodes,
          deselectedDrugs: deselection.deselectedDrugNames,
        },
      });
    }

    // Log finalization
    logAuditEntry({
      action: 'consultation_finalized',
      entityType: 'consultation',
      entityId: existingConsultation?.id || 'new',
      patientId: selectedPatient.id,
      performedBy: user.id,
      performedByName: user.name,
    });

    toast({
      title: 'Consultation Finalized',
      description: `Consultation for ${selectedPatient.firstName} ${selectedPatient.lastName} has been finalized.`,
    });

    navigate('/doctor/queue');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <DashboardLayout allowedRoles={['doctor']}>
      {selectedPatient ? (
        <ConsultationForm
          patient={selectedPatient}
          vitals={vitals}
          existingConsultation={existingConsultation}
          resolvedPrices={resolvedPrices}
          summary={summary}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          onCancel={handleCancel}
          onFormDataChange={(labOrders, prescriptions) => {
            setCurrentLabOrders(labOrders);
            setCurrentPrescriptions(prescriptions);
          }}
        />
      ) : (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <Stethoscope className="h-12 w-12 mx-auto text-primary" />
            <h1 className="text-2xl font-bold">New Consultation</h1>
            <p className="text-muted-foreground">
              Search for a patient to begin a consultation
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PatientSearch
                onSelect={handleSelectPatient}
                autoFocus
              />
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
