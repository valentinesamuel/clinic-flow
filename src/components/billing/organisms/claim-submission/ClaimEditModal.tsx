import { useState } from 'react';
import { format } from 'date-fns';
import { Check, ChevronLeft, AlertTriangle, Upload, X, File, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { HMOClaim, ClaimDocument, ClaimDiagnosis } from '@/types/billing.types';
import { DiagnosisSelector } from '@/components/billing/molecules/diagnosis/DiagnosisSelector';

interface ClaimEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: HMOClaim;
  mode: 'edit' | 'resubmit';
  onSave: (claim: Partial<HMOClaim>) => void;
  onSubmit: (claim: Partial<HMOClaim>) => void;
  onCancel: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ClaimEditModal({
  open,
  onOpenChange,
  claim,
  mode,
  onSave,
  onSubmit,
  onCancel,
}: ClaimEditModalProps) {
  const isResubmit = mode === 'resubmit';
  
  // Editable fields
  const [policyNumber, setPolicyNumber] = useState(claim.policyNumber || '');
  const [enrollmentId, setEnrollmentId] = useState(claim.enrollmentId);
  const [preAuthCode, setPreAuthCode] = useState(claim.preAuthCode || '');
  const [resubmissionNotes, setResubmissionNotes] = useState('');
  const [diagnoses, setDiagnoses] = useState<ClaimDiagnosis[]>(claim.diagnoses || []);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const buildClaimData = (): Partial<HMOClaim> => {
    const newDocuments: ClaimDocument[] = uploadedFiles.map((f, i) => ({
      id: `doc-new-${Date.now()}-${i}`,
      name: f.name,
      type: 'manual' as const,
      uploadedAt: new Date().toISOString(),
      size: f.size,
    }));

    return {
      ...claim,
      policyNumber,
      enrollmentId,
      preAuthCode: preAuthCode || undefined,
      diagnoses,
      resubmissionNotes: isResubmit ? resubmissionNotes : undefined,
      documents: [...claim.documents, ...newDocuments],
      currentVersion: claim.currentVersion + 1,
    };
  };

  const handleSave = () => {
    onSave(buildClaimData());
  };

  const handleSubmit = () => {
    if (isResubmit && !resubmissionNotes.trim()) {
      return; // Require notes for resubmission
    }
    onSubmit(buildClaimData());
  };

  const handleClose = () => {
    setPolicyNumber(claim.policyNumber || '');
    setEnrollmentId(claim.enrollmentId);
    setPreAuthCode(claim.preAuthCode || '');
    setResubmissionNotes('');
    setDiagnoses(claim.diagnoses || []);
    setUploadedFiles([]);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isResubmit ? (
              <>
                <RotateCcw className="h-5 w-5" />
                Resubmit Claim
              </>
            ) : (
              'Edit Claim'
            )}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {claim.claimNumber} (v{claim.currentVersion} → v{claim.currentVersion + 1})
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 p-1">
            {/* Denial Reason (for resubmit) */}
            {isResubmit && claim.denialReason && (
              <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Denial Reason</p>
                    <p className="text-sm mt-1">{claim.denialReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Read-only fields */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Patient</span>
                <span className="text-sm font-medium">{claim.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">HMO Provider</span>
                <span className="text-sm font-medium">{claim.hmoProviderName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bill</span>
                <span className="text-sm font-mono">{claim.billIds.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Claim Amount</span>
                <span className="text-sm font-semibold">{formatCurrency(claim.claimAmount)}</span>
              </div>
            </div>

            {/* Diagnoses */}
            <div className="space-y-2">
              <Label>Diagnoses (ICD-10)</Label>
              <DiagnosisSelector
                selectedDiagnoses={diagnoses}
                onDiagnosesChange={setDiagnoses}
                required={false}
              />
            </div>

            {/* Editable fields */}
            {!isResubmit && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="policy">Policy Number</Label>
                  <Input
                    id="policy"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. NHIA-12345-6789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollment">Enrollment ID</Label>
                  <Input
                    id="enrollment"
                    value={enrollmentId}
                    onChange={(e) => setEnrollmentId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preauth">Pre-Authorization Code</Label>
                  <Input
                    id="preauth"
                    value={preAuthCode}
                    onChange={(e) => setPreAuthCode(e.target.value.toUpperCase())}
                  />
                </div>
              </>
            )}

            {/* Resubmission Notes (required for resubmit) */}
            {isResubmit && (
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Resubmission Notes <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="notes"
                  value={resubmissionNotes}
                  onChange={(e) => setResubmissionNotes(e.target.value)}
                  placeholder="Explain the corrections made to address the denial reason..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Required: Describe what changes were made to address the denial.
                </p>
              </div>
            )}

            {/* Existing Documents */}
            <div className="space-y-2">
              <Label>Existing Documents ({claim.documents.length})</Label>
              <div className="space-y-2">
                {claim.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm truncate">{doc.name}</span>
                    <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Additional Documents */}
            <div className="space-y-2">
              <Label>Upload Additional Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-edit"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="file-upload-edit" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <File className="h-4 w-4 text-primary" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">New</Badge>
                    <button onClick={() => handleRemoveFile(index)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!isResubmit && (
            <Button variant="secondary" onClick={handleSave}>
              Save Draft
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isResubmit && !resubmissionNotes.trim()}
          >
            <Check className="h-4 w-4 mr-1" />
            {isResubmit ? 'Resubmit Claim' : 'Submit Claim'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
