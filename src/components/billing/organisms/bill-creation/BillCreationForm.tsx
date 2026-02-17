import { useState, useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Search, Plus, X, User, UserPlus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { BillItem, ServiceCategory, Bill } from '@/types/billing.types';
import { usePatientSearch } from '@/hooks/queries/usePatientQueries';
import { useServiceItems } from '@/hooks/queries/useBillQueries';
import type { ServiceItem } from '@/data/bill-items';

const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  consultation: 'Consultation',
  lab: 'Lab',
  pharmacy: 'Pharmacy',
  procedure: 'Procedure',
  admission: 'Admission',
  other: 'Other',
};
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { HMOBillSummary } from '@/components/billing/molecules/hmo/HMOBillSummary';
import { HMOItemStatusBadge } from '@/components/atoms/display/HMOItemStatusBadge';
import { calculateBillCoverage } from '@/utils/hmoCoverage';
import { useClaims } from '@/hooks/queries/useClaimQueries';
import { HMOClaimExistencePopup } from '@/components/billing/organisms/hmo-bill-check/HMOClaimExistencePopup';

interface BillCreationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPatient?: Patient | null;
  onComplete: (bill: Partial<Bill>) => void;
  onCancel: () => void;
}

interface SelectedItem extends ServiceItem {
  quantity: number;
  discount: number;
  total: number;
}

type Step = 1 | 2 | 3;

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
    <div className="flex items-center gap-2">
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
        'text-sm hidden sm:inline',
        isActive && 'font-medium text-foreground',
        !isActive && 'text-muted-foreground'
      )}>
        {label}
      </span>
      {step < 3 && <div className={cn('h-0.5 w-4 sm:w-8', step < currentStep ? 'bg-primary' : 'bg-muted')} />}
    </div>
  );
}

export function BillCreationForm({
  open,
  onOpenChange,
  preselectedPatient,
  onComplete,
  onCancel,
}: BillCreationFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(preselectedPatient ? 2 : 1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('consultation');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [showHMOClaimPopup, setShowHMOClaimPopup] = useState(false);
  const [existingClaim, setExistingClaim] = useState<any | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');

  // Hooks must be at top level
  const { data: patientSearchResults = [] } = usePatientSearch(patientSearchQuery.length >= 2 ? patientSearchQuery : '');
  const { data: serviceItemsData = [] } = useServiceItems();
  const { data: claimsData = [] } = useClaims();

  // Search patients
  const patientResults = useMemo(() => {
    if (patientSearchQuery.length < 2) return [];
    return (patientSearchResults as any[]).slice(0, 10);
  }, [patientSearchQuery, patientSearchResults]);

  // Build category items from hook data
  const categoryItems: Record<ServiceCategory, ServiceItem[]> = useMemo(() => {
    const items = serviceItemsData as any[];
    return {
      consultation: items.filter((i: any) => i.category === 'consultation'),
      lab: items.filter((i: any) => i.category === 'lab'),
      pharmacy: items.filter((i: any) => i.category === 'pharmacy'),
      procedure: items.filter((i: any) => i.category === 'procedure'),
      admission: [],
      other: items.filter((i: any) => i.category === 'other'),
    };
  }, [serviceItemsData]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    const items = categoryItems[activeCategory] || [];
    if (!itemSearchQuery) return items;
    const lowerQuery = itemSearchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(lowerQuery));
  }, [activeCategory, itemSearchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const discount = selectedItems.reduce((sum, item) => sum + item.discount, 0);
    return { subtotal, discount, tax: 0, total: subtotal };
  }, [selectedItems]);

  // Calculate HMO coverage for items if patient is HMO
  const hmoCoverage = useMemo(() => {
    if (isWalkIn) return null;
    if (!selectedPatient || selectedPatient.paymentType !== 'hmo' || selectedItems.length === 0) {
      return null;
    }
    const billItems: BillItem[] = selectedItems.map((item) => ({
      id: item.id,
      description: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.defaultPrice,
      discount: item.discount,
      total: item.total,
    }));
    const hmoProviderId = selectedPatient.hmoDetails?.providerId || '';
    return calculateBillCoverage(billItems, hmoProviderId);
  }, [selectedPatient, selectedItems, isWalkIn]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchOpen(false);
    setPatientSearchQuery('');

    // Check for existing pending HMO claims
    if (patient.paymentType === 'hmo') {
      const pendingClaim = (claimsData as any[]).find(
        (c: any) => c.patientId === patient.id && ['draft', 'submitted', 'processing'].includes(c.status)
      );
      if (pendingClaim) {
        setExistingClaim(pendingClaim);
        setShowHMOClaimPopup(true);
        return;
      }
    }

    if (currentStep === 1) setCurrentStep(2);
  };

  const handleAddItem = (item: ServiceItem) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.defaultPrice - i.discount }
            : i
        )
      );
    } else {
      setSelectedItems(prev => [
        ...prev,
        { ...item, quantity: 1, discount: 0, total: item.defaultPrice },
      ]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedItems(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, quantity, total: quantity * i.defaultPrice - i.discount }
          : i
      )
    );
  };

  const handleUpdateDiscount = (itemId: string, discount: number) => {
    setSelectedItems(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, discount, total: i.quantity * i.defaultPrice - discount }
          : i
      )
    );
  };

  const handleGenerateBill = () => {
    if (!selectedPatient && !isWalkIn) return;
    if (isWalkIn && !walkInName.trim()) return;

    const billItems = hmoCoverage
      ? hmoCoverage.items
      : selectedItems.map(item => ({
          id: item.id,
          description: item.name,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.defaultPrice,
          discount: item.discount,
          total: item.total,
        }));

    const bill: Partial<Bill> = {
      patientId: isWalkIn ? 'walk-in' : selectedPatient!.id,
      patientName: isWalkIn ? walkInName.trim() : `${selectedPatient!.firstName} ${selectedPatient!.lastName}`,
      patientMrn: isWalkIn ? 'WALK-IN' : selectedPatient!.mrn,
      items: billItems,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      amountPaid: 0,
      balance: totals.total,
      status: 'pending',
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      // Walk-in fields
      isWalkIn: isWalkIn || undefined,
      walkInCustomerName: isWalkIn ? walkInName.trim() : undefined,
      walkInPhone: isWalkIn && walkInPhone.trim() ? walkInPhone.trim() : undefined,
      // No HMO for walk-in
      hmoTotalCoverage: isWalkIn ? undefined : hmoCoverage?.hmoTotalCoverage,
      patientTotalLiability: isWalkIn ? undefined : hmoCoverage?.patientTotalLiability,
    };

    onComplete(bill);
  };

  const handleClose = () => {
    setCurrentStep(preselectedPatient ? 2 : 1);
    setSelectedPatient(preselectedPatient || null);
    setSelectedItems([]);
    setNotes('');
    setVisitReason('');
    setIsWalkIn(false);
    setWalkInName('');
    setWalkInPhone('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 py-4">
          <StepIndicator step={1} currentStep={currentStep} label="Patient" />
          <StepIndicator step={2} currentStep={currentStep} label="Items" />
          <StepIndicator step={3} currentStep={currentStep} label="Review" />
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Step 1: Select Patient */}
          {currentStep === 1 && (
            <div className="space-y-4 p-1">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={!isWalkIn ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setIsWalkIn(false); setWalkInName(''); setWalkInPhone(''); }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Registered Patient
                </Button>
                <Button
                  variant={isWalkIn ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setIsWalkIn(true); setSelectedPatient(null); }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Walk-in Customer
                </Button>
              </div>

              {isWalkIn ? (
                <div className="space-y-4">
                  <Alert className="border-amber-200 bg-amber-50">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Walk-in customers can only pay with cash, card, or bank transfer. HMO payment is not available for unregistered patients.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number (optional)</Label>
                    <Input
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                    />
                  </div>
                  {walkInName.trim() && (
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <UserPlus className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{walkInName}</p>
                          {walkInPhone && <p className="text-sm text-muted-foreground">{walkInPhone}</p>}
                        </div>
                        <Badge variant="outline" className="text-amber-600 border-amber-300">Walk-in</Badge>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Search Patient</Label>
                  <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedPatient
                        ? `${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.mrn})`
                        : 'Search by name or MRN...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Type to search..."
                        value={patientSearchQuery}
                        onValueChange={setPatientSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No patients found.</CommandEmpty>
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
                        compact={false}
                      />
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* Step 2: Add Items */}
          {currentStep === 2 && (
            <div className="flex flex-col h-[50vh]">
              <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ServiceCategory)}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  {(['consultation', 'lab', 'pharmacy', 'procedure', 'other'] as ServiceCategory[]).map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">
                      {SERVICE_CATEGORY_LABELS[cat]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mt-4 flex gap-4 flex-1 min-h-0">
                  {/* Available Items */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={itemSearchQuery}
                        onChange={(e) => setItemSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <ScrollArea className="flex-1 border rounded-lg">
                      <div className="p-2 space-y-1">
                        {filteredItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAddItem(item)}
                            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent text-left"
                          >
                            <span className="text-sm">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {formatCurrency(item.defaultPrice)}
                              </span>
                              <Plus className="h-4 w-4 text-primary" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Selected Items */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Selected Items ({selectedItems.length})</Label>
                      <span className="font-semibold">{formatCurrency(totals.total)}</span>
                    </div>
                    <ScrollArea className="flex-1 border rounded-lg">
                      <div className="p-2 space-y-2">
                        {selectedItems.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8 text-sm">
                            No items added yet
                          </p>
                        ) : (
                          selectedItems.map((item) => (
                            <div key={item.id} className="p-2 rounded-md bg-muted/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{item.name}</span>
                                <button onClick={() => handleRemoveItem(item.id)}>
                                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Qty:</span>
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 h-7 text-center"
                                />
                                <span className="flex-1 text-right font-medium">
                                  {formatCurrency(item.total)}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </Tabs>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 p-1">
                {/* Patient */}
                {(selectedPatient || isWalkIn) && (
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Patient</p>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${isWalkIn ? 'bg-amber-100' : 'bg-primary/10'} flex items-center justify-center`}>
                        {isWalkIn ? <UserPlus className="h-5 w-5 text-amber-600" /> : <User className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{isWalkIn ? walkInName : `${selectedPatient!.firstName} ${selectedPatient!.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{isWalkIn ? (walkInPhone || 'No phone') : selectedPatient!.mrn}</p>
                      </div>
                      {isWalkIn && <Badge variant="outline" className="text-amber-600 border-amber-300">Walk-in</Badge>}
                    </div>
                  </div>
                )}

                {/* Items Summary */}
                <div className="p-4 rounded-lg border space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">Items</p>
                  {(hmoCoverage ? hmoCoverage.items : selectedItems).map((item) => {
                    const hmoItem = hmoCoverage?.items.find((i) => i.id === item.id);
                    return (
                      <div key={item.id} className="flex justify-between text-sm items-center">
                        <div className="flex items-center gap-2">
                          <span>
                            {'name' in item ? item.name : item.description} × {'quantity' in item ? item.quantity : 1}
                          </span>
                          {hmoItem?.hmoStatus && <HMOItemStatusBadge status={hmoItem.hmoStatus} />}
                        </div>
                        <span>{formatCurrency(item.total)}</span>
                      </div>
                    );
                  })}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                {/* HMO Coverage Summary */}
                {hmoCoverage && (
                  <HMOBillSummary
                    items={hmoCoverage.items}
                    hmoTotalCoverage={hmoCoverage.hmoTotalCoverage}
                    patientTotalLiability={hmoCoverage.patientTotalLiability}
                    totalBill={totals.total}
                  />
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this bill..."
                    rows={3}
                  />
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep((currentStep - 1) as Step)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          {currentStep === 1 && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {currentStep === 1 && (selectedPatient || (isWalkIn && walkInName.trim())) && (
            <Button onClick={() => setCurrentStep(2)}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          {currentStep === 2 && (
            <Button onClick={() => setCurrentStep(3)} disabled={selectedItems.length === 0}>
              Review Bill
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button onClick={handleGenerateBill}>
              <Check className="h-4 w-4 mr-1" />
              Generate Bill
            </Button>
          )}
        </div>
      </DialogContent>

      {/* HMO Claim Existence Popup */}
      {existingClaim && (
        <HMOClaimExistencePopup
          open={showHMOClaimPopup}
          onOpenChange={setShowHMOClaimPopup}
          existingClaim={existingClaim}
          onAddToExisting={() => {
            setShowHMOClaimPopup(false);
            setCurrentStep(2);
          }}
          onPayOutOfPocket={() => {
            setShowHMOClaimPopup(false);
            setCurrentStep(2);
          }}
        />
      )}
    </Dialog>
  );
}
