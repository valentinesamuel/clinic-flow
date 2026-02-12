import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ClinicalJustificationFieldProps {
  itemName: string;
  isOffProtocol: boolean;
  justification: string;
  onChange: (value: string) => void;
}

export function ClinicalJustificationField({
  itemName,
  isOffProtocol,
  justification,
  onChange,
}: ClinicalJustificationFieldProps) {
  if (!isOffProtocol) return null;

  return (
    <div className="space-y-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <Label className="text-sm font-medium text-amber-700">
          Clinical Justification Required
        </Label>
        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
          Off-Protocol
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        &quot;{itemName}&quot; is not in the standard protocol for the selected diagnosis.
        Please provide clinical justification for this service.
      </p>
      <Textarea
        value={justification}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Explain the clinical necessity for this service..."
        rows={2}
        className="text-sm"
      />
    </div>
  );
}
