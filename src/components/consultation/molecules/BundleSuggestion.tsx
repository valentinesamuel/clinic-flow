import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProtocolBundle } from '@/types/financial.types';
import { BundleDeselectionRecord } from '@/types/consultation.types';
import { Package, X } from 'lucide-react';

interface BundleSuggestionProps {
  bundle: ProtocolBundle;
  onApply: (
    labs: { testCode: string; testName: string; priority: 'routine' | 'urgent' | 'stat'; notes: string }[],
    meds: { drugName: string; dosage: string; frequency: string; duration: string; quantity: number; instructions: string }[],
  ) => void;
  onDismiss: () => void;
  onDeselectionLog?: (record: BundleDeselectionRecord) => void;
  doctorId?: string;
}

export function BundleSuggestion({ bundle, onApply, onDismiss, onDeselectionLog, doctorId }: BundleSuggestionProps) {
  const [selectedLabs, setSelectedLabs] = useState<Set<string>>(
    new Set(bundle.labTests.map(t => t.testCode))
  );
  const [selectedMeds, setSelectedMeds] = useState<Set<string>>(new Set());

  const toggleLab = (testCode: string) => {
    setSelectedLabs(prev => {
      const next = new Set(prev);
      if (next.has(testCode)) next.delete(testCode);
      else next.add(testCode);
      return next;
    });
  };

  const toggleMed = (drugName: string) => {
    setSelectedMeds(prev => {
      const next = new Set(prev);
      if (next.has(drugName)) next.delete(drugName);
      else next.add(drugName);
      return next;
    });
  };

  const buildDeselectionRecord = (): BundleDeselectionRecord | undefined => {
    const deselectedLabs = bundle.labTests
      .filter(t => !selectedLabs.has(t.testCode))
      .map(t => t.testCode);
    const deselectedMeds = bundle.medications
      .filter(m => !selectedMeds.has(m.drugName))
      .map(m => m.drugName);

    if (deselectedLabs.length === 0 && deselectedMeds.length === 0) return undefined;

    return {
      bundleId: bundle.id,
      bundleName: bundle.name,
      deselectedLabTestCodes: deselectedLabs,
      deselectedDrugNames: deselectedMeds,
      timestamp: new Date().toISOString(),
      doctorId: doctorId || '',
    };
  };

  const handleApply = () => {
    const labsToApply = bundle.labTests.filter(t => selectedLabs.has(t.testCode));
    const medsToApply = bundle.medications.filter(m => selectedMeds.has(m.drugName));

    const labs = labsToApply.map(t => ({
      testCode: t.testCode,
      testName: t.testName,
      priority: t.priority,
      notes: t.notes || '',
    }));

    const meds = medsToApply.map(m => ({
      drugName: m.drugName,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      quantity: m.quantity,
      instructions: m.instructions,
    }));

    const deselection = buildDeselectionRecord();
    if (deselection) {
      onDeselectionLog?.(deselection);
    }

    onApply(labs, meds);
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <Package className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{bundle.name}</p>
            </div>
          </div>
          <button onClick={onDismiss} className="shrink-0 p-1 hover:bg-accent rounded" type="button">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        {bundle.labTests.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Lab Tests</p>
            {bundle.labTests.map(test => (
              <label key={test.testCode} className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={selectedLabs.has(test.testCode)}
                  onCheckedChange={() => toggleLab(test.testCode)}
                />
                <span>{test.testName}</span>
              </label>
            ))}
          </div>
        )}

        {bundle.medications.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Medications</p>
            {bundle.medications.map(med => (
              <label key={med.drugName} className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={selectedMeds.has(med.drugName)}
                  onCheckedChange={() => toggleMed(med.drugName)}
                />
                <span>{med.drugName} ({med.dosage}, {med.frequency})</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" className="h-7 text-xs" onClick={handleApply}>
            Apply Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
