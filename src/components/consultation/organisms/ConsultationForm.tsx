import { useState, useCallback } from 'react';
import { Patient } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { Consultation } from '@/types/clinical.types';
import { PayerType, ResolvedPrice, FinancialSummary } from '@/types/financial.types';
import { ConsultationFormData, BundleDeselectionRecord, JustificationEntry } from '@/types/consultation.types';
import { useConsultationForm } from '@/hooks/useConsultationForm';
import { useBundleSuggestion } from '@/hooks/useBundleSuggestion';
import { useJustificationTriggers, JustificationTriggerInfo } from '@/hooks/useJustificationTriggers';
import { useHMOAlerts } from '@/hooks/useHMOAlerts';
import { PatientBanner } from '../molecules/PatientBanner';
import { SOAPSubjective } from '../molecules/SOAPSubjective';
import { SOAPObjective } from '../molecules/SOAPObjective';
import { SOAPAssessment } from '../molecules/SOAPAssessment';
import { SOAPPlan } from '../molecules/SOAPPlan';
import { LabOrderPanel } from '../molecules/LabOrderPanel';
import { PrescriptionPanel } from '../molecules/PrescriptionPanel';
import { FinancialSidebar } from '../molecules/FinancialSidebar';
import { BundleSuggestion } from '../molecules/BundleSuggestion';
import { JustificationModal } from '../molecules/JustificationModal';
import { HMOAlertBanner } from '../molecules/HMOAlertBanner';
import { FinalizeConfirmationDialog } from '../molecules/FinalizeConfirmationDialog';
import { EditModeBanner } from '@/components/shared/EditModeBanner';
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import type { PatientLabResult } from '@/types/consultation.types';
import { useEffect } from 'react';

interface ConsultationFormProps {
  patient: Patient;
  vitals?: VitalSigns | null;
  existingConsultation?: Consultation;
  resolvedPrices: ResolvedPrice[];
  summary: FinancialSummary;
  onSaveDraft: (formData: ConsultationFormData) => void;
  onFinalize: (formData: ConsultationFormData) => void;
  onCancel: () => void;
  onFormDataChange?: (labOrders: ConsultationFormData['labOrders'], prescriptions: ConsultationFormData['prescriptionItems']) => void;
}

export function ConsultationForm({
  patient,
  vitals,
  existingConsultation,
  resolvedPrices,
  summary,
  onSaveDraft,
  onFinalize,
  onCancel,
  onFormDataChange,
}: ConsultationFormProps) {
  const form = useConsultationForm();
  const [labPanelOpen, setLabPanelOpen] = useState(false);
  const [rxPanelOpen, setRxPanelOpen] = useState(false);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [activeJustificationTrigger, setActiveJustificationTrigger] = useState<JustificationTriggerInfo | null>(null);

  // Map patient payment type to financial payer type
  const payerType: PayerType = patient.paymentType;
  const hmoProviderId = patient.hmoDetails?.providerId;
  const hmoName = patient.hmoDetails?.providerName;
  const isHMO = payerType === 'hmo';

  // Bundle suggestions
  const { suggestedBundles, dismissBundle, markApplied } = useBundleSuggestion(
    form.formData.selectedDiagnoses,
    form.formData.labOrders,
    form.formData.prescriptionItems,
  );

  // Build patient lab results from existing data for conflict detection
  const patientLabResults: PatientLabResult[] = [];

  // Justification triggers
  const { triggers, unresolvedCount } = useJustificationTriggers(
    form.formData.labOrders,
    form.formData.prescriptionItems,
    resolvedPrices,
    patientLabResults,
    form.formData.justifications,
  );

  // HMO alerts
  const { alerts: hmoAlerts } = useHMOAlerts(
    hmoProviderId,
    form.formData.selectedDiagnoses,
    vitals,
    form.formData.labOrders,
  );

  // Hydrate from existing consultation if resuming a draft
  useEffect(() => {
    if (existingConsultation) {
      form.hydrateForm(existingConsultation);
    }
  }, [existingConsultation?.id]);

  // Notify parent of form data changes for financial sidebar
  useEffect(() => {
    onFormDataChange?.(form.formData.labOrders, form.formData.prescriptionItems);
  }, [form.formData.labOrders, form.formData.prescriptionItems]);

  const handleFinalize = () => {
    onFinalize(form.formData);
    setFinalizeDialogOpen(false);
  };

  const handleApplyBundle = useCallback((
    bundleId: string,
    labs: { testCode: string; testName: string; priority: 'routine' | 'urgent' | 'stat'; notes: string }[],
    meds: { drugName: string; dosage: string; frequency: string; duration: string; quantity: number; instructions: string }[],
    deselection?: BundleDeselectionRecord,
  ) => {
    labs.forEach(lab => {
      if (!form.formData.labOrders.some(o => o.testCode === lab.testCode)) {
        form.addLabOrder(lab);
      }
    });
    meds.forEach(med => {
      if (!form.formData.prescriptionItems.some(p => p.drugName === med.drugName)) {
        form.addPrescriptionItem(med);
      }
    });
    markApplied(bundleId, deselection);
    if (deselection) {
      form.recordBundleDeselection(deselection);
    }
  }, [form, markApplied]);

  const handleJustificationSubmit = useCallback((text: string) => {
    if (!activeJustificationTrigger) return;
    const entry: JustificationEntry = {
      triggerId: activeJustificationTrigger.triggerId,
      triggerType: activeJustificationTrigger.triggerType,
      triggerDescription: activeJustificationTrigger.triggerDescription,
      justificationText: text,
      itemId: activeJustificationTrigger.itemId,
      itemName: activeJustificationTrigger.itemName,
      timestamp: new Date().toISOString(),
    };
    form.addJustification(entry);
    setActiveJustificationTrigger(null);
  }, [activeJustificationTrigger, form]);

  // Show justification modal for unresolved triggers when user tries to finalize
  const handleFinalizeClick = () => {
    const unresolved = triggers.find(
      t => !form.formData.justifications.some(j => j.triggerId === t.triggerId && j.justificationText.length >= 30)
    );
    if (unresolved) {
      setActiveJustificationTrigger(unresolved);
    } else {
      setFinalizeDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky patient banner */}
      <PatientBanner patient={patient} vitals={vitals} />

      {/* Edit mode banner — replaces bottom footer */}
      <EditModeBanner
        title="Consultation Note"
        subtitle={`${patient.firstName} ${patient.lastName}`}
        onCancel={onCancel}
        onSaveDraft={() => onSaveDraft(form.formData)}
        onFinalize={handleFinalizeClick}
        saveDraftDisabled={!form.isDirty}
        finalizeDisabled={!form.isValid || unresolvedCount > 0}
      />

      {/* 3-column layout — sidebars stay fixed, only center scrolls */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex">
          {/* Left column — Vitals (fixed in place, lg+ only) */}
          <div className="hidden lg:block w-72 shrink-0 border-r overflow-y-auto p-4">
            {vitals ? (
              <VitalSignsCard vitals={vitals} compact />
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No vitals recorded
              </div>
            )}
          </div>

          {/* Center column — SOAP sections (only this scrolls) */}
          <div className="flex-1 min-w-0 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                <SOAPSubjective
                  chiefComplaint={form.formData.chiefComplaint}
                  onChiefComplaintChange={(v) => form.updateField('chiefComplaint', v)}
                  hpi={form.formData.historyOfPresentIllness}
                  onHPIChange={(v) => form.updateField('historyOfPresentIllness', v)}
                />

                <SOAPObjective
                  physicalExamination={form.formData.physicalExamination}
                  onChange={(v) => form.updateField('physicalExamination', v)}
                  vitals={vitals}
                  hideVitals
                />

                <SOAPAssessment
                  selectedDiagnoses={form.formData.selectedDiagnoses}
                  onAdd={form.addDiagnosis}
                  onRemove={form.removeDiagnosis}
                  onSetPrimary={form.setPrimaryDiagnosis}
                />

                {/* HMO Alerts */}
                {isHMO && hmoAlerts.length > 0 && (
                  <HMOAlertBanner alerts={hmoAlerts} />
                )}

                {/* Bundle suggestions */}
                {suggestedBundles.length > 0 && (
                  <div className="space-y-2">
                    {suggestedBundles.map(bundle => (
                      <BundleSuggestion
                        key={bundle.id}
                        bundle={bundle}
                        onApply={(labs, meds) => handleApplyBundle(bundle.id, labs, meds)}
                        onDismiss={() => dismissBundle(bundle.id)}
                        onDeselectionLog={(record) =>
                          handleApplyBundle(
                            bundle.id,
                            bundle.labTests
                              .filter(t => !record.deselectedLabTestCodes.includes(t.testCode))
                              .map(t => ({ testCode: t.testCode, testName: t.testName, priority: t.priority, notes: t.notes || '' })),
                            bundle.medications
                              .filter(m => !record.deselectedDrugNames.includes(m.drugName))
                              .map(m => ({ drugName: m.drugName, dosage: m.dosage, frequency: m.frequency, duration: m.duration, quantity: m.quantity, instructions: m.instructions })),
                            record,
                          )
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Unresolved justification triggers */}
                {triggers.length > 0 && (
                  <div className="space-y-1">
                    {triggers
                      .filter(t => !form.formData.justifications.some(j => j.triggerId === t.triggerId && j.justificationText.length >= 30))
                      .map(trigger => (
                        <button
                          key={trigger.triggerId}
                          className="w-full text-left p-2 rounded border border-amber-200 bg-amber-50 text-sm hover:bg-amber-100 transition-colors"
                          onClick={() => setActiveJustificationTrigger(trigger)}
                          type="button"
                        >
                          <span className="font-medium text-amber-800">Justification needed: </span>
                          <span className="text-amber-700">{trigger.itemName}</span>
                        </button>
                      ))}
                  </div>
                )}

                <SOAPPlan
                  treatmentPlan={form.formData.treatmentPlan}
                  onChange={(v) => form.updateField('treatmentPlan', v)}
                  locked={!form.hasDiagnoses}
                  prescriptionCount={form.formData.prescriptionItems.length}
                  labOrderCount={form.formData.labOrders.length}
                  onAddPrescription={() => setRxPanelOpen(true)}
                  onAddLabOrder={() => setLabPanelOpen(true)}
                  followUpDate={form.formData.followUpDate}
                  onFollowUpChange={(v) => form.updateField('followUpDate', v)}
                />
              </div>
            </div>

          {/* Right column — Financial sidebar (fixed in place, lg+ only) */}
          <div className="hidden lg:block w-80 shrink-0 border-l overflow-y-auto p-4">
            <FinancialSidebar
              resolvedPrices={resolvedPrices}
              summary={summary}
              payerType={payerType}
              hmoName={hmoName}
            />
          </div>
        </div>
      </div>

      {/* Side panels */}
      <LabOrderPanel
        open={labPanelOpen}
        onOpenChange={setLabPanelOpen}
        labOrders={form.formData.labOrders}
        onAdd={form.addLabOrder}
        onRemove={form.removeLabOrder}
        onUpdate={form.updateLabOrder}
      />

      <PrescriptionPanel
        open={rxPanelOpen}
        onOpenChange={setRxPanelOpen}
        items={form.formData.prescriptionItems}
        onAdd={form.addPrescriptionItem}
        onRemove={form.removePrescriptionItem}
        onUpdate={form.updatePrescriptionItem}
        patientAllergies={patient.allergies}
      />

      {/* Justification modal */}
      <JustificationModal
        open={!!activeJustificationTrigger}
        onOpenChange={(open) => { if (!open) setActiveJustificationTrigger(null); }}
        trigger={activeJustificationTrigger}
        onSubmit={handleJustificationSubmit}
      />

      {/* Rich finalize confirmation */}
      <FinalizeConfirmationDialog
        open={finalizeDialogOpen}
        onOpenChange={setFinalizeDialogOpen}
        onConfirm={handleFinalize}
        formData={form.formData}
        isHMO={isHMO}
        hmoAlerts={hmoAlerts}
        unresolvedJustifications={unresolvedCount}
      />
    </div>
  );
}
