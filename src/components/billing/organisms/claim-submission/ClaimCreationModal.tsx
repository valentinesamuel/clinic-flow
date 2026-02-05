import { useState, useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Search, User, Shield, FileText, Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Patient } from '@/types/patient.types';
import { Bill, HMOClaim, ClaimDocument, HMOProvider } from '@/types/billing.types';
import { searchPatients, getPatientById } from '@/data/patients';
import { getBillsByPatient, getBillById } from '@/data/bills';
import { mockHMOProviders } from '@/data/claims';
import { HMOProviderSelector } from '@/components/billing/molecules/hmo/HMOProviderSelector';
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';

interface ClaimCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedBill?: Bill | null;
  preselectedPatient?: Patient | null;
  onComplete: (claim: Partial<HMOClaim>) => void;
  onSaveDraft: (claim: Partial<HMOClaim>) => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StepIndicator({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
          isActive && 'bg-primary text-primary-foreground',
          isCompleted && 'bg-primary/20 text-primary',
          !isActive && !isCompleted && 'bg-muted text-muted-foreground'
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : step}
      </div>
      <span className={cn(
        'text-xs hidden sm:inline',
        isActive && 'font-medium text-foreground',
        !isActive && 'text-muted-foreground'
      )}>
        {label}
      </span>
    </div>
  );
}

interface AutoDocument {
  id: string;
  name: string;
  type: 'auto';
  source: string;
  selected: boolean;
}

export function ClaimCreationModal({
  open,
  onOpenChange,
  preselectedBill,
  preselectedPatient,
  onComplete,
  onSaveDraft,
  onCancel,
}: ClaimCreationModalProps) {
  // Determine initial step based on preselected data
  const getInitialStep = (): Step => {
    if (preselectedBill) return 2;
    if (preselectedPatient) return 1;
    return 1;
  };

  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(preselectedBill || null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);

  // HMO Details
  const [hmoProviderId, setHmoProviderId] = useState(selectedPatient?.hmoDetails?.providerId || '');
  const [policyNumber, setPolicyNumber] = useState(selectedPatient?.hmoDetails?.enrollmentId?.split('-').slice(-1)[0] || '');
  const [enrollmentId, setEnrollmentId] = useState(selectedPatient?.hmoDetails?.enrollmentId || '');
  const [preAuthCode, setPreAuthCode] = useState('');

  // Documents
  const [autoDocuments, setAutoDocuments] = useState<AutoDocument[]>([
    { id: 'doc-auto-1', name: 'Consultation Note', type: 'auto', source: 'consultation', selected: true },
    { id: 'doc-auto-2', name: 'Lab Results', type: 'auto', source: 'lab', selected: true },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Search patients
  const patientResults = useMemo(() => {
    if (patientSearchQuery.length < 2) return [];
    return searchPatients(patientSearchQuery).filter(p => p.paymentType === 'hmo').slice(0, 10);
  }, [patientSearchQuery]);

  // Get patient's pending bills
  const patientBills = useMemo(() => {
    if (!selectedPatient) return [];
    return getBillsByPatient(selectedPatient.id).filter(b => 
      (b.status === 'pending' || b.status === 'partial') && b.paymentMethod === 'hmo'
    );
  }, [selectedPatient]);

  // Calculate claim amount from bill
  const claimAmount = selectedBill?.balance || 0;

  // Get HMO provider name
  const selectedProvider = useMemo(() => {
    return mockHMOProviders.find(p => p.id === hmoProviderId);
  }, [hmoProviderId]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchOpen(false);
    setPatientSearchQuery('');
    // Pre-fill HMO details from patient
    if (patient.hmoDetails) {
      setHmoProviderId(patient.hmoDetails.providerId);
      setEnrollmentId(patient.hmoDetails.enrollmentId);
    }
  };

  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleToggleAutoDoc = (docId: string) => {
    setAutoDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const buildClaimData = (): Partial<HMOClaim> => {
    const documents: ClaimDocument[] = [
      ...autoDocuments.filter(d => d.selected).map(d => ({
        id: d.id,
        name: `${d.name}.pdf`,
        type: 'auto' as const,
        source: d.source,
        uploadedAt: new Date().toISOString(),
      })),
      ...uploadedFiles.map((f, i) => ({
        id: `doc-manual-${i}`,
        name: f.name,
        type: 'manual' as const,
        uploadedAt: new Date().toISOString(),
        size: f.size,
      })),
    ];

    return {
      patientId: selectedPatient?.id,
      patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : undefined,
      hmoProviderId,
      hmoProviderName: selectedProvider?.name,
      policyNumber: policyNumber || undefined,
      enrollmentId,
      preAuthCode: preAuthCode || undefined,
      billId: selectedBill?.id,
      claimAmount,
      documents,
      versions: [],
      currentVersion: 1,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = () => {
    const claimData = buildClaimData();
    claimData.status = 'submitted';
    claimData.submittedAt = new Date().toISOString();
    onComplete(claimData);
  };

  const handleSaveDraft = () => {
    const claimData = buildClaimData();
    claimData.status = 'draft';
    onSaveDraft(claimData);
  };

  const handleClose = () => {
    setCurrentStep(getInitialStep());
    setSelectedPatient(preselectedPatient || null);
    setSelectedBill(preselectedBill || null);
    setHmoProviderId('');
    setPolicyNumber('');
    setEnrollmentId('');
    setPreAuthCode('');
    setUploadedFiles([]);
    onCancel();
  };

  const canProceed = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!selectedPatient && !!selectedBill;
      case 2:
        return !!hmoProviderId && !!enrollmentId;
      case 3:
        return true; // Items are auto-populated
      case 4:
        return true; // Documents are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create HMO Claim</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center gap-4 py-4">
          <StepIndicator step={1} currentStep={currentStep} label="Patient & Bill" />
          <StepIndicator step={2} currentStep={currentStep} label="HMO Details" />
          <StepIndicator step={3} currentStep={currentStep} label="Items" />
          <StepIndicator step={4} currentStep={currentStep} label="Documents" />
          <StepIndicator step={5} currentStep={currentStep} label="Review" />
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Step 1: Select Patient & Bill */}
          {currentStep === 1 && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                {/* Patient Search */}
                <div className="space-y-2">
                  <Label>Patient (HMO Only)</Label>
                  <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedPatient
                          ? `${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.mrn})`
                          : 'Search HMO patients...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Type to search..."
                          value={patientSearchQuery}
                          onValueChange={setPatientSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No HMO patients found.</CommandEmpty>
                          <CommandGroup>
                            {patientResults.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                onSelect={() => handleSelectPatient(patient)}
                                className="flex items-center gap-3 py-3"
                              >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {patient.firstName} {patient.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{patient.mrn}</p>
                                </div>
                                <InsuranceBadge paymentType={patient.paymentType} hmoName={patient.hmoDetails?.providerName} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Patient Card */}
                {selectedPatient && (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedPatient.mrn}</p>
                      </div>
                      <InsuranceBadge
                        paymentType={selectedPatient.paymentType}
                        hmoName={selectedPatient.hmoDetails?.providerName}
                      />
                    </div>
                  </div>
                )}

                {/* Bill Selection */}
                {selectedPatient && (
                  <div className="space-y-2">
                    <Label>Select Bill</Label>
                    {patientBills.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-4 border rounded-lg text-center">
                        No pending HMO bills for this patient
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {patientBills.map((bill) => (
                          <div
                            key={bill.id}
                            onClick={() => handleSelectBill(bill)}
                            className={cn(
                              "p-4 rounded-lg border cursor-pointer transition-colors",
                              selectedBill?.id === bill.id
                                ? "border-primary bg-primary/5"
                                : "hover:bg-accent/50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{bill.billNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {bill.items.length} items
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(bill.balance)}</p>
                                <Badge variant="outline">{bill.status}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Step 2: HMO Details */}
          {currentStep === 2 && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>HMO Provider</Label>
                  <HMOProviderSelector selected={hmoProviderId} onChange={setHmoProviderId} />
                </div>

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
                    placeholder="e.g. HYG-2024-ABC123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preauth">Pre-Authorization Code (Optional)</Label>
                  <Input
                    id="preauth"
                    value={preAuthCode}
                    onChange={(e) => setPreAuthCode(e.target.value.toUpperCase())}
                    placeholder="If already obtained"
                  />
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Step 3: Claim Items (Read-only from bill) */}
          {currentStep === 3 && selectedBill && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                <p className="text-sm text-muted-foreground">
                  Items from bill {selectedBill.billNumber} will be included in this claim.
                </p>
                <div className="space-y-2">
                  {selectedBill.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Claim Amount</span>
                  <span className="text-lg">{formatCurrency(claimAmount)}</span>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                {/* Auto-attached documents */}
                <div className="space-y-2">
                  <Label>Auto-Attached Documents</Label>
                  <div className="space-y-2">
                    {autoDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <Checkbox
                          id={doc.id}
                          checked={doc.selected}
                          onCheckedChange={() => handleToggleAutoDoc(doc.id)}
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <label htmlFor={doc.id} className="flex-1 text-sm cursor-pointer">
                          {doc.name}
                        </label>
                        <Badge variant="outline" className="text-xs">Auto</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual upload */}
                <div className="space-y-2">
                  <Label>Upload Additional Documents</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
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
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <button onClick={() => handleRemoveFile(index)}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                {/* Patient */}
                {selectedPatient && (
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Patient</p>
                    <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                    <p className="text-sm text-muted-foreground">{selectedPatient.mrn}</p>
                  </div>
                )}

                {/* HMO */}
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">HMO Provider</p>
                  <p className="font-medium">{selectedProvider?.name}</p>
                  <p className="text-sm text-muted-foreground">Enrollment: {enrollmentId}</p>
                  {preAuthCode && (
                    <p className="text-sm text-muted-foreground">Pre-Auth: {preAuthCode}</p>
                  )}
                </div>

                {/* Bill */}
                {selectedBill && (
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Linked Bill</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{selectedBill.billNumber}</p>
                      <p className="font-semibold">{formatCurrency(claimAmount)}</p>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">Documents</p>
                  <p className="text-sm">
                    {autoDocuments.filter(d => d.selected).length} auto-attached, {uploadedFiles.length} uploaded
                  </p>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-between pt-4 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep((currentStep - 1) as Step)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button onClick={() => setCurrentStep((currentStep + 1) as Step)} disabled={!canProceed(currentStep)}>
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button onClick={handleSubmit}>
                  <Check className="h-4 w-4 mr-1" />
                  Submit Claim
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
