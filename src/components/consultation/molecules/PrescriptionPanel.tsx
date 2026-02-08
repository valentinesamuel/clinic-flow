import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ConsultationPrescriptionItem } from '@/types/consultation.types';
import { PHARMACY_ITEMS } from '@/data/bill-items';
import { Search, Plus, X, Pill, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

interface PrescriptionPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ConsultationPrescriptionItem[];
  onAdd: (item: Omit<ConsultationPrescriptionItem, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ConsultationPrescriptionItem>) => void;
  patientAllergies?: string[];
}

export function PrescriptionPanel({ open, onOpenChange, items, onAdd, onRemove, onUpdate, patientAllergies = [] }: PrescriptionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Auto-expand the most recently added item
  useEffect(() => {
    if (items.length > 0) {
      setExpandedId(items[items.length - 1].id);
    }
  }, [items.length]);

  const filteredDrugs = PHARMACY_ITEMS.filter(item =>
    item.isActive && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (drug: typeof PHARMACY_ITEMS[0]) => {
    onAdd({
      drugName: drug.name,
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 1,
      instructions: '',
    });
  };

  const hasAllergyWarning = (drugName: string) => {
    const lowerDrug = drugName.toLowerCase();
    return patientAllergies.some(a => lowerDrug.includes(a.toLowerCase()));
  };

  const getSummary = (item: ConsultationPrescriptionItem) => {
    const parts = [item.dosage, item.frequency, item.duration].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No details yet';
  };

  const handleDone = () => {
    const errors: Record<string, string[]> = {};
    items.forEach(item => {
      const itemErrors: string[] = [];
      if (!item.dosage.trim()) itemErrors.push('dosage');
      if (!item.frequency.trim()) itemErrors.push('frequency');
      if (itemErrors.length > 0) errors[item.id] = itemErrors;
    });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Expand the first item with errors
      const firstErrorId = Object.keys(errors)[0];
      setExpandedId(firstErrorId);
      return;
    }
    setValidationErrors({});
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription
            {items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medications..."
              className="pl-10"
            />
          </div>

          {/* Available drugs */}
          {searchQuery.length > 0 && (
            <div className="max-h-[150px] overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 pr-4">
                  {filteredDrugs.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAdd(item)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent text-left"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{item.name}</span>
                        {hasAllergyWarning(item.name) && (
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        )}
                      </div>
                      <Plus className="h-4 w-4 ml-2 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <Separator />

          {/* Selected items */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h4 className="text-sm font-medium mb-2">Prescribed Items ({items.length})</h4>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No medications prescribed</p>
                )}
                {items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const itemErrors = validationErrors[item.id] || [];
                  const hasErrors = itemErrors.length > 0;

                  return (
                    <Collapsible
                      key={item.id}
                      open={isExpanded}
                      onOpenChange={(open) => setExpandedId(open ? item.id : null)}
                    >
                      <div className={`border rounded-lg ${hasErrors ? 'border-destructive' : ''}`}>
                        <div className="flex items-center gap-2 p-2">
                          <CollapsibleTrigger asChild>
                            <button className="shrink-0 p-1 hover:bg-accent rounded" type="button">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </CollapsibleTrigger>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.drugName}</p>
                            {!isExpanded && (
                              <p className="text-xs text-muted-foreground truncate">{getSummary(item)}</p>
                            )}
                          </div>
                          {hasAllergyWarning(item.drugName) && (
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <CollapsibleContent>
                          <div className="px-3 pb-3 space-y-2">
                            {hasAllergyWarning(item.drugName) && (
                              <Alert variant="destructive" className="py-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Potential allergy match detected!
                                </AlertDescription>
                              </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Dosage *</Label>
                                <Input
                                  value={item.dosage}
                                  onChange={(e) => onUpdate(item.id, { dosage: e.target.value })}
                                  placeholder="e.g., 500mg"
                                  className={`h-8 text-xs ${itemErrors.includes('dosage') ? 'border-destructive' : ''}`}
                                />
                                {itemErrors.includes('dosage') && (
                                  <p className="text-xs text-destructive mt-0.5">Required</p>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs">Frequency *</Label>
                                <Input
                                  value={item.frequency}
                                  onChange={(e) => onUpdate(item.id, { frequency: e.target.value })}
                                  placeholder="e.g., Twice daily"
                                  className={`h-8 text-xs ${itemErrors.includes('frequency') ? 'border-destructive' : ''}`}
                                />
                                {itemErrors.includes('frequency') && (
                                  <p className="text-xs text-destructive mt-0.5">Required</p>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs">Duration</Label>
                                <Input
                                  value={item.duration}
                                  onChange={(e) => onUpdate(item.id, { duration: e.target.value })}
                                  placeholder="e.g., 7 days"
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => onUpdate(item.id, { quantity: parseInt(e.target.value) || 1 })}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Instructions</Label>
                              <Input
                                value={item.instructions}
                                onChange={(e) => onUpdate(item.id, { instructions: e.target.value })}
                                placeholder="e.g., Take after meals"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <Button onClick={handleDone}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
