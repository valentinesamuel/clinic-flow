import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AmendmentReason } from '@/types/consultation.types';

const REASON_OPTIONS: { value: AmendmentReason; label: string }[] = [
  { value: 'typo', label: 'Typo / Minor Correction' },
  { value: 'new_clinical_data', label: 'New Clinical Data' },
  { value: 'hmo_rejection_fix', label: 'HMO Rejection Fix' },
  { value: 'other', label: 'Other' },
];

interface AmendmentReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: AmendmentReason, detail?: string) => void;
}

export function AmendmentReasonDialog({ open, onOpenChange, onConfirm }: AmendmentReasonDialogProps) {
  const [reason, setReason] = useState<AmendmentReason>('typo');
  const [detail, setDetail] = useState('');

  const handleConfirm = () => {
    onConfirm(reason, detail || undefined);
    setReason('typo');
    setDetail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Amend Consultation Note</DialogTitle>
          <DialogDescription>
            Select a reason for amending this finalized consultation. The current version will be preserved in the version history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={reason}
            onValueChange={(v) => setReason(v as AmendmentReason)}
            className="space-y-2"
          >
            {REASON_OPTIONS.map(opt => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`reason-${opt.value}`} />
                <Label htmlFor={`reason-${opt.value}`} className="text-sm cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-1.5">
            <Label htmlFor="amendment-detail" className="text-sm">
              Additional Detail (optional)
            </Label>
            <Textarea
              id="amendment-detail"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="Provide additional context for this amendment..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Begin Amendment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
