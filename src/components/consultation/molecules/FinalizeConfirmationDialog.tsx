import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ConsultationFormData } from '@/types/consultation.types';
import { HMOAlertResult } from '@/data/hmo-rules';

interface FinalizeConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  formData: ConsultationFormData;
  isHMO: boolean;
  hmoAlerts: HMOAlertResult[];
  unresolvedJustifications: number;
}

export function FinalizeConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  formData,
  isHMO,
  hmoAlerts,
  unresolvedJustifications,
}: FinalizeConfirmationDialogProps) {
  const primaryDiagnosis = formData.selectedDiagnoses.find(d => d.isPrimary);
  const additionalCount = formData.selectedDiagnoses.length - 1;

  const hmoChecklist = isHMO
    ? [
        {
          label: 'Primary diagnosis present',
          passed: formData.selectedDiagnoses.length > 0,
        },
        {
          label: 'Lab tests ordered',
          passed: formData.labOrders.length > 0,
        },
        {
          label: 'All prescriptions have required fields',
          passed: formData.prescriptionItems.every(
            p => p.drugName && p.dosage && p.frequency && p.duration && p.quantity > 0,
          ),
        },
        {
          label: 'Treatment plan documented',
          passed: formData.treatmentPlan.trim().length > 0,
        },
      ]
    : [];

  const hmoChecklistFailures = hmoChecklist.filter(c => !c.passed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Finalize Consultation</DialogTitle>
          <DialogDescription>
            Review the summary below before finalizing. This action creates lab
            orders and prescriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Summary */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Summary</p>
            {primaryDiagnosis && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-xs">
                  {primaryDiagnosis.code}
                </Badge>
                <span>{primaryDiagnosis.description}</span>
              </div>
            )}
            {formData.selectedDiagnoses.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {
                  formData.selectedDiagnoses.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {d.code}
                      </Badge>
                      <span>{d.description}</span>
                    </div>
                  ))
                }
              </div>
            )}
            {additionalCount > 0 && (
              <p className="text-xs text-muted-foreground">
                + {additionalCount} additional{" "}
                {additionalCount === 1 ? "diagnosis" : "diagnoses"}
              </p>
            )}

            {formData.labOrders.length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Lab Tests: </span>
                {formData.labOrders.map((o) => o.testName).join(", ")}
              </div>
            )}

            {formData.prescriptionItems.length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Prescriptions: </span>
                {formData.prescriptionItems.map((p) => p.drugName).join(", ")}
              </div>
            )}

            {formData.followUpDate && (
              <div className="text-sm">
                <span className="text-muted-foreground">Follow-up: </span>
                {formData.followUpDate}
              </div>
            )}
          </div>

          {/* HMO Checklist */}
          {isHMO && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">HMO Compliance Checklist</p>
                {hmoChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span className={item.passed ? "" : "text-amber-700"}>
                      {item.label}
                    </span>
                  </div>
                ))}
                {hmoAlerts.filter((a) => !a.passed).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {hmoAlerts
                      .filter((a) => !a.passed)
                      .map((alert) => (
                        <div
                          key={alert.rule.id}
                          className="flex items-center gap-2 text-sm text-amber-700"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>{alert.rule.message}</span>
                        </div>
                      ))}
                  </div>
                )}
                {hmoChecklistFailures.length > 0 && (
                  <p className="text-xs text-amber-600">
                    Some HMO requirements are not met. You can still finalize,
                    but claims may be rejected.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Unresolved justifications */}
          {unresolvedJustifications > 0 && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>
                  {unresolvedJustifications} unresolved justification
                  {unresolvedJustifications !== 1 ? "s" : ""} pending. Please
                  resolve all justifications before finalizing.
                </span>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button onClick={onConfirm} disabled={unresolvedJustifications > 0}>
            Confirm & Finalize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
