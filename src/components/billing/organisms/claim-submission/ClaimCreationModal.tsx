import { useState, useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Search, User, Shield, FileText, Upload, X, File, Stethoscope } from 'lucide-react';
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
import { Bill, HMOClaim, ClaimDocument, ClaimDiagnosis, HMOProvider } from '@/types/billing.types';
import { usePatientSearch, usePatients } from '@/hooks/queries/usePatientQueries';
import { useBills } from '@/hooks/queries/useBillQueries';
import { useHMOProviders } from '@/hooks/queries/useReferenceQueries';
import { HMOProviderSelector } from '@/components/billing/molecules/hmo/HMOProviderSelector';
import { DiagnosisSelector } from '@/components/billing/molecules/diagnosis/DiagnosisSelector';
import { DiagnosisServiceSuggestion } from '@/components/billing/molecules/diagnosis/DiagnosisServiceSuggestion';
import { ClinicalJustificationField } from '@/components/billing/molecules/claim/ClinicalJustificationField';
import { DocumentUploadZone } from '@/components/billing/molecules/documents/DocumentUploadZone';
import { DocumentList } from '@/components/billing/molecules/documents/DocumentList';
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { HMOItemStatusBadge } from '@/components/atoms/display/HMOItemStatusBadge';
import { ICD10Code } from '@/types/clinical.types';
import { useCommonICD10, useICD10ServiceMappings } from '@/hooks/queries/useReferenceQueries';
import { buildClaimItemsFromBill } from '@/utils/hmoCoverage';
import { ICD10ServiceMapping } from '@/types/financial.types';

interface ClaimCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedBill?: Bill | null;
  preselectedPatient?: Patient | null;
  onComplete: (claim: Partial<HMOClaim>) => void;
  onSaveDraft: (claim: Partial<HMOClaim>) => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

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
  const [selectedBills, setSelectedBills] = useState<Bill[]>(preselectedBill ? [preselectedBill] : []);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);

  // HMO Details
  const [hmoProviderId, setHmoProviderId] = useState(selectedPatient?.hmoDetails?.providerId || '');
  const [policyNumber, setPolicyNumber] = useState(selectedPatient?.hmoDetails?.enrollmentId?.split('-').slice(-1)[0] || '');
  const [enrollmentId, setEnrollmentId] = useState(selectedPatient?.hmoDetails?.enrollmentId || '');
  const [preAuthCode, setPreAuthCode] = useState('');

  // Diagnoses (ICD-10)
  const [diagnoses, setDiagnoses] = useState<ClaimDiagnosis[]>([]);

  // Clinical justifications for off-protocol items
  const [justifications, setJustifications] = useState<Record<string, string>>({});

  // Diagnosis service selection tracking
  const [selectedDiagnosisServiceIds, setSelectedDiagnosisServiceIds] = useState<string[]>([]);
  const [serviceJustifications, setServiceJustifications] = useState<Record<string, string>>({});

  // Documents
  const [autoDocuments, setAutoDocuments] = useState<AutoDocument[]>([
    { id: 'doc-auto-1', name: 'Consultation Note', type: 'auto', source: 'consultation', selected: true },
    { id: 'doc-auto-2', name: 'Lab Results', type: 'auto', source: 'lab', selected: true },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // React Query hooks
  const { data: patientSearchResults = [] } = usePatientSearch(patientSearchQuery.length >= 2 ? patientSearchQuery : '');
  const { data: billsData = [] } = useBills();
  const { data: hmoProvidersData = [] } = useHMOProviders();
  const { data: commonICD10Data = [] } = useCommonICD10();
  const { data: icd10ServiceMappingsData = [] } = useICD10ServiceMappings();

  // Search patients
  const patientResults = useMemo(() => {
    if (patientSearchQuery.length < 2) return [];
    return (patientSearchResults as Patient[]).filter((p) => p.paymentType === 'hmo').slice(0, 10);
  }, [patientSearchQuery, patientSearchResults]);

  // Get patient's pending bills
  const patientBills = useMemo(() => {
    if (!selectedPatient) return [];
    return (billsData as Bill[]).filter((b) =>
      b.patientId === selectedPatient.id &&
      (b.status === 'pending' || b.status === 'partial') && b.paymentMethod === 'hmo'
    );
  }, [selectedPatient, billsData]);

  // Build pre-populated claim items from first selected bill with HMO coverage
  const prePopulatedClaim = useMemo(() => {
    if (selectedBills.length === 0 || !hmoProviderId) return null;
    return buildClaimItemsFromBill(selectedBills[0], hmoProviderId);
  }, [selectedBills, hmoProviderId]);

  // Calculate claim amount from all selected bills
  const claimAmount = selectedBills.length > 0
    ? selectedBills.reduce((sum, bill) => sum + bill.balance, 0)
    : 0;

  // Get approved services for selected diagnoses
  const diagnosisServiceMappings = useMemo(() => {
    if (diagnoses.length === 0) return [];
    const diagnosisCodes = diagnoses.map((d) => d.code);
    return (icd10ServiceMappingsData as ICD10ServiceMapping[]).filter((mapping) =>
      diagnosisCodes.includes(mapping.icd10Code)
    );
  }, [diagnoses, icd10ServiceMappingsData]);

  // Aggregate all items from all selected bills
  const allSelectedBillItems = useMemo(() => {
    return selectedBills.flatMap(bill => bill.items);
  }, [selectedBills]);

  // Check which bill items are off-protocol
  const offProtocolItems = useMemo(() => {
    if (allSelectedBillItems.length === 0 || diagnosisServiceMappings.length === 0) return [];
    const approvedServiceIds = new Set(
      diagnosisServiceMappings.flatMap((m) => m.approvedServiceIds)
    );
    return allSelectedBillItems.filter((item) => !approvedServiceIds.has(item.id));
  }, [allSelectedBillItems, diagnosisServiceMappings]);

  // Get HMO provider name
  const selectedProvider = useMemo(() => {
    return (hmoProvidersData as HMOProvider[]).find((p) => p.id === hmoProviderId);
  }, [hmoProviderId, hmoProvidersData]);

  // Get suggested diagnoses based on common codes
  const suggestedDiagnoses = useMemo((): ICD10Code[] => {
    return commonICD10Data as ICD10Code[];
  }, [commonICD10Data]);

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

  const handleToggleBill = (bill: Bill) => {
    setSelectedBills(prev => {
      const exists = prev.some(b => b.id === bill.id);
      if (exists) return prev.filter(b => b.id !== bill.id);
      return [...prev, bill];
    });
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
      billIds: selectedBills.map(b => b.id),
      claimAmount,
      diagnoses,
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
    setSelectedBills(preselectedBill ? [preselectedBill] : []);
    setHmoProviderId('');
    setPolicyNumber('');
    setEnrollmentId('');
    setPreAuthCode('');
    setDiagnoses([]);
    setSelectedDiagnosisServiceIds([]);
    setServiceJustifications({});
    setUploadedFiles([]);
    onCancel();
  };

  const canProceed = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!selectedPatient && selectedBills.length > 0;
      case 2:
        return !!hmoProviderId && !!enrollmentId;
      case 3:
        return diagnoses.length > 0; // At least one diagnosis required
      case 4:
        return true; // Items are auto-populated
      case 5:
        return true; // Documents are optional
      case 6:
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
        <div className="flex justify-center gap-2 py-4 overflow-x-auto">
          <StepIndicator step={1} currentStep={currentStep} label="Patient" />
          <StepIndicator step={2} currentStep={currentStep} label="HMO" />
          <StepIndicator step={3} currentStep={currentStep} label="Diagnosis" />
          <StepIndicator step={4} currentStep={currentStep} label="Items" />
          <StepIndicator step={5} currentStep={currentStep} label="Docs" />
          <StepIndicator step={6} currentStep={currentStep} label="Review" />
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
                    <Label>Select Bills</Label>
                    {patientBills.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-4 border rounded-lg text-center">
                        No pending HMO bills for this patient
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {patientBills.map((bill) => {
                          const isSelected = selectedBills.some(b => b.id === bill.id);
                          return (
                            <div
                              key={bill.id}
                              onClick={() => handleToggleBill(bill)}
                              className={cn(
                                "p-4 rounded-lg border cursor-pointer transition-colors",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-accent/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox checked={isSelected} />
                                <div className="flex-1">
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
                              </div>
                            </div>
                          );
                        })}
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

          {/* Step 3: Diagnosis (ICD-10) */}
          {currentStep === 3 && (
            <ScrollArea className="h-[45vh]">
              <div className="p-1">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <Label className="text-base">Diagnosis Codes (ICD-10)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add at least one diagnosis code. The first code added will be marked as primary.
                  </p>
                </div>
                <DiagnosisSelector
                  selectedDiagnoses={diagnoses}
                  onDiagnosesChange={setDiagnoses}
                  suggestedCodes={suggestedDiagnoses}
                  required={true}
                />

                {/* Diagnosis Service Suggestions */}
                {diagnoses.length > 0 && (
                  <div className="mt-4">
                    <DiagnosisServiceSuggestion
                      diagnosisCodes={diagnoses.map((d) => d.code)}
                      onAddService={(serviceId, serviceName) => {
                        setSelectedDiagnosisServiceIds((prev) =>
                          prev.includes(serviceId) ? prev : [...prev, serviceId]
                        );
                      }}
                      onRemoveService={(serviceId, serviceName, justification) => {
                        setSelectedDiagnosisServiceIds((prev) =>
                          prev.filter((id) => id !== serviceId)
                        );
                        if (justification) {
                          setServiceJustifications((prev) => ({ ...prev, [serviceId]: justification }));
                        }
                      }}
                      selectedServiceIds={[
                        ...allSelectedBillItems.map((i) => i.id),
                        ...selectedDiagnosisServiceIds,
                      ]}
                      serviceJustifications={serviceJustifications}
                      onJustificationChange={(serviceId, justification) => {
                        setServiceJustifications((prev) => ({ ...prev, [serviceId]: justification }));
                      }}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Step 4: Claim Items (Read-only from bills) */}
          {currentStep === 4 && selectedBills.length > 0 && (
            <ScrollArea className="h-[45vh]">
              <div className="space-y-4 p-1">
                <p className="text-sm text-muted-foreground">
                  Items from {selectedBills.length} bill{selectedBills.length > 1 ? 's' : ''} ({selectedBills.map(b => b.billNumber).join(', ')}) will be included in this claim.
                  {prePopulatedClaim && ' Amounts reflect HMO coverage.'}
                </p>
                <div className="space-y-2">
                  {(prePopulatedClaim?.claimItems || allSelectedBillItems.map((item) => ({
                    id: item.id,
                    description: item.description,
                    category: item.category,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    claimedAmount: item.total,
                  }))).map((item) => {
                    const isOffProtocol = offProtocolItems.some((opi) => opi.id === item.id);
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{item.description}</p>
                              {isOffProtocol && (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Off-Protocol</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <span className="font-medium">{formatCurrency(item.claimedAmount)}</span>
                        </div>
                        {isOffProtocol && (
                          <ClinicalJustificationField
                            itemName={item.description}
                            isOffProtocol={true}
                            justification={justifications[item.id] || ''}
                            onChange={(value) => setJustifications((prev) => ({ ...prev, [item.id]: value }))}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Claim Amount</span>
                  <span className="text-lg">{formatCurrency(claimAmount)}</span>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
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
                  <DocumentUploadZone
                    onFilesSelected={(files) => setUploadedFiles((prev) => [...prev, ...files])}
                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={10}
                    multiple={true}
                  />
                </div>

                {/* Uploaded files list */}
                {uploadedFiles.length > 0 && (
                  <DocumentList
                    documents={uploadedFiles.map((f, i) => ({
                      id: `doc-manual-${i}`,
                      name: f.name,
                      type: 'manual' as const,
                      uploadedAt: new Date().toISOString(),
                      size: f.size,
                    }))}
                    onRemove={(id) => {
                      const index = parseInt(id.replace('doc-manual-', ''));
                      handleRemoveFile(index);
                    }}
                    readOnly={false}
                  />
                )}
              </div>
            </ScrollArea>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
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

                {/* Diagnoses */}
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">Diagnoses</p>
                  <div className="space-y-1">
                    {diagnoses.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{d.code}</Badge>
                        <span className="text-sm">{d.description}</span>
                        {d.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bills */}
                {selectedBills.length > 0 && (
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Linked Bills</p>
                    {selectedBills.map(bill => (
                      <div key={bill.id} className="flex items-center justify-between py-1">
                        <p className="font-medium">{bill.billNumber}</p>
                        <p className="text-sm">{formatCurrency(bill.balance)}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t mt-2">
                      <p className="font-semibold text-sm">Total Claim</p>
                      <p className="font-semibold">{formatCurrency(claimAmount)}</p>
                    </div>
                  </div>
                )}

                {/* Claim Items */}
                {selectedBills.length > 0 && (
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Claim Items</p>
                    <div className="space-y-2">
                      {(prePopulatedClaim?.claimItems || allSelectedBillItems.map((item) => ({
                        id: item.id,
                        description: item.description,
                        category: item.category,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        claimedAmount: item.total,
                        isOffProtocol: offProtocolItems.some((opi) => opi.id === item.id),
                      }))).map((item) => {
                        const isOffProtocol = 'isOffProtocol' in item ? item.isOffProtocol : offProtocolItems.some((opi) => opi.id === item.id);
                        return (
                          <div key={item.id} className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="truncate">{item.description}</span>
                              {isOffProtocol && (
                                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 shrink-0">Off-Protocol</Badge>
                              )}
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <span className="text-muted-foreground text-xs">{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                              <span className="ml-2 font-medium">{formatCurrency(item.claimedAmount)}</span>
                            </div>
                          </div>
                        );
                      })}
                      {offProtocolItems.length > 0 && Object.keys(justifications).length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Clinical Justifications</p>
                          {Object.entries(justifications).filter(([, v]) => v).map(([itemId, text]) => {
                            const item = allSelectedBillItems.find(i => i.id === itemId);
                            return (
                              <div key={itemId} className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">{item?.description}:</span> {text}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-sm">
                        <span>Total Claim Amount</span>
                        <span>{formatCurrency(claimAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">Documents</p>
                  <DocumentList
                    documents={[
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
                    ]}
                    readOnly={true}
                  />
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
            {currentStep < 6 ? (
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
