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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { JustificationTriggerInfo } from '@/hooks/useJustificationTriggers';

const MIN_CHARS = 30;

interface JustificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: JustificationTriggerInfo | null;
  onSubmit: (text: string) => void;
}

export function JustificationModal({ open, onOpenChange, trigger, onSubmit }: JustificationModalProps) {
  const [text, setText] = useState('');

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(text);
    setText('');
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setText('');
    onOpenChange(newOpen);
  };

  if (!trigger) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Justification Required
          </DialogTitle>
          <DialogDescription className="text-left">
            {trigger.triggerDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={trigger.triggerType === 'conflict' ? 'destructive' : 'secondary'}>
              {trigger.triggerType === 'conflict' ? 'Conflict' : 'High Value'}
            </Badge>
            <span className="text-sm font-medium">{trigger.itemName}</span>
          </div>

          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Provide clinical justification for this order (minimum 30 characters)..."
            rows={4}
          />

          <p className={`text-xs ${isValid ? 'text-muted-foreground' : 'text-amber-600'}`}>
            {charCount}/{MIN_CHARS} characters minimum
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Submit Justification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
