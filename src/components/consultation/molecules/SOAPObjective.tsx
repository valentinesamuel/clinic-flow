import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SOAPSectionHeader } from '../atoms/SOAPSectionHeader';
import { VitalSigns } from '@/types/clinical.types';
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { Eye } from 'lucide-react';

interface SOAPObjectiveProps {
  physicalExamination: string;
  onChange: (value: string) => void;
  vitals?: VitalSigns | null;
  readOnly?: boolean;
  hideVitals?: boolean;
}

export function SOAPObjective({ physicalExamination, onChange, vitals, readOnly, hideVitals }: SOAPObjectiveProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <SOAPSectionHeader
          icon={<Eye className="h-4 w-4 text-green-500" />}
          title="Objective"
          description="Clinical findings and examination"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {vitals && !hideVitals && (
          <VitalSignsCard vitals={vitals} compact />
        )}
        <div className="space-y-2">
          <Label htmlFor="physical-exam">Physical Examination *</Label>
          {readOnly ? (
            <p className="text-sm text-muted-foreground">{physicalExamination}</p>
          ) : (
            <Textarea
              id="physical-exam"
              value={physicalExamination}
              onChange={(e) => onChange(e.target.value)}
              placeholder="General appearance, specific system findings, relevant positives and negatives..."
              rows={4}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
